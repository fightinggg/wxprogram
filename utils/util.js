/**
 * @description: 获取系统信息
 */
export const getSystemInfo = () => {
  const result = wx.getSystemInfoSync()

  let res = {
    bottomSafeHeight: 0,
    navigationBarHeight: 0,
    statusBarHeight: 0,
    dpr: 1,
    safeHeight: 0,
  }

  // 是否是ios
  const ios = !!(result.system.toLowerCase().search('ios') + 1)

  // ios下weui navigation-bar高度44px,不是ios48px
  res.navigationBarHeight = ios ? 44 : 48

  // 设备像素比
  res.dpr = result.pixelRatio

  // 状态栏高度
  const statusBarHeight = result.statusBarHeight
  res.statusBarHeight = statusBarHeight

  // 安全区域
  const safeArea = result.safeArea
  // 可视区域高度 - 适配横竖屏场景
  const screenHeight = Math.max(result.screenHeight, result.screenWidth)
  const height = Math.max(safeArea.height, safeArea.width)
  // 获取底部安全区域高度（全面屏手机）
  if (safeArea && height && screenHeight) {
    const bottomSafeHeight = screenHeight - height - statusBarHeight
    res.bottomSafeHeight = bottomSafeHeight < 0 ? 0 : bottomSafeHeight
  }

  // 真实可用高度
  res.safeHeight = result.screenHeight - res.navigationBarHeight - statusBarHeight - res.bottomSafeHeight
  // 真实可用宽度
  res.safeWidth = result.screenWidth

  return res
}
