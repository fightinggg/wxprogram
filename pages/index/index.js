import { getSystemInfo } from "../../utils/util.js";

Component({
  data: {
    show: true,

    // 画布控制器
    canvasContext: null,

    canvas: null,

    id: "CANVAS_" + new Date().getTime(),

    width: 0,
    height: 0,

    canvasPosX: 0,
    canvasPosY: 0,

    imgs: []
  },

  lifetimes: {
    attached() {
      // 高度计算
      const res = getSystemInfo();

      this.dpr = res.dpr;

      this.setData({
        width: res.safeWidth,
        height: res.safeHeight,
      });
    },
    ready() {
      this._initContext();
    },
  },

  methods: {
    // 初始化canvas画布
    _initContext() {
      const query = this.createSelectorQuery();
      query
        .select(`#${this.data.id}`)
        .fields({ node: true, size: true })
        .exec((res) => {
          const canvas = res[0].node;
          const ctx = canvas.getContext("2d");

          canvas.width = res[0].width * this.dpr;
          canvas.height = res[0].height * this.dpr;

          ctx.scale(this.dpr, this.dpr);

          this.setData({
            canvasContext: ctx,
            canvas: canvas,
          });
        });
    },


    

    _start(e) {
      this.setData({
        canvasPosX: e.changedTouches[0].x,
        canvasPosY: e.changedTouches[0].y,
      });
      this.data.canvasContext.lineWidth = 2;
      console.log(`move To ${this.data.canvasPosX} ${this.data.canvasPosY}`)

      this.data.imgs.push({
        type: 'moveTo',
        x:this.data.canvasPosX,
        y:this.data.canvasPosY
      })
      this.data.canvasContext.moveTo(
        this.data.canvasPosX,
        this.data.canvasPosY
      );
    },

    _move(e) {
      const { canvasContext, canvasPosX, canvasPosY } = this.data;

      this.setData({
        canvasPosX: e.changedTouches[0].x,
        canvasPosY: e.changedTouches[0].y,
      });
      console.log(`lineTo To ${canvasPosX} ${canvasPosY}`)
      this.data.imgs.push({
        type: 'lineTo',
        x:canvasPosX,
        y:canvasPosY
      })
      console.log(this.data.imgs)
      canvasContext.lineTo(canvasPosX, canvasPosY);
      canvasContext.stroke();
    },


    // 清空画布
    _clear() {
      const { canvasContext, width, height } = this.data;
      canvasContext.clearRect(0, 0, width, height);

      canvasContext.beginPath();
      this.data.imgs = []
    },

    _rollback(){
      const imgs = this.data.imgs
      if(imgs.length==0){
        return
      }
      const lastOp = []
      while(true){
        if(imgs.length==0){
          console.log("BUG!!!!!")
          this._clear()
        }

        const last = imgs.pop()
        lastOp.push(last)
        if(last.type=='moveTo'){
          console.log(lastOp)
          console.log(imgs)
          break
        }
      }
    }

  },
});
