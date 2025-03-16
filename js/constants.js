// 定数
const EARTH_RADIUS = 30; // 地球の半径（ピクセル）
const MOON_RADIUS = 8; // 月の半径（ピクセル）（地球との実際の大きさの比率に近づけた）
const MOON_DISTANCE = 200; // 月の軌道半径（ピクセル）
const MOON_ANGULAR_VELOCITY = -0.025; // 月の角速度（円軌道速度に合わせて調整、反時計回りに変更）
const TRAIL_LENGTH = 100; // 軌道の長さ（ポイント数）

// 重力定数
const MU_EARTH = 5000; // 地球の重力定数
const MU_MOON = 100; // 月の重力定数（弱めに設定）

// 色
const EARTH_COLOR = [0, 100, 255]; // 地球の色（青）
const MOON_COLOR = [255, 255, 0]; // 月の色（黄色）
const BOUND_ORBIT_COLOR = [0, 255, 0]; // 束縛軌道の色（緑）
const ESCAPE_ORBIT_COLOR = [0, 255, 255]; // 脱出軌道の色（水色）
const SPACECRAFT_COLOR = [255, 255, 255]; // 宇宙船の色（白）
