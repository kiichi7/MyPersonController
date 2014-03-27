//外接物体
var walker : GameObject;
var walkPlayer : GameObject;
var jumpUpPlayer : GameObject;
var jumpDownPlayer : GameObject;
var firstPersonTarget : GameObject;
var playSpeed = 3.0;
var theDopplerLevel = 0.0;
//所有声音根据运动速度调节
var minWalkVolume = 0.2;
var maxWalkVolume = 1.0;
var minJumpVolume = 0.5;
var maxJumpVolume = 1.0;
//内部参数
private var timer = 1000.0;
private var jumpTimer = 1000.0;
private var playGap : float;

function Update () {

	if (!walker.GetComponent(MoveController).isMoving) timer = playGap;
	timer += Time.deltaTime;
	jumpTimer += Time.deltaTime;
	if (jumpTimer > 0.2) {
		if ((!walker.GetComponent(MoveController).isGrounded)&&(walker.GetComponent(MoveController).lastGrounded)) {
			jumpUpPlayer.GetComponent(SoundPlayer).Play(Mathf.Clamp(walker.GetComponent(MoveController).speed/5 , minJumpVolume , maxJumpVolume),theDopplerLevel);
			jumpTimer = 0;
			timer = 0;
		}
		if ((walker.GetComponent(MoveController).isGrounded)&&(!walker.GetComponent(MoveController).lastGrounded)) {
			jumpDownPlayer.GetComponent(SoundPlayer).Play(Mathf.Clamp(walker.GetComponent(MoveController).speed/5 , minJumpVolume , maxJumpVolume),theDopplerLevel);
			jumpTimer = 0;
			timer = 0;
		}
	}
	
	playGap = playSpeed / Mathf.Sqrt(1 + walker.GetComponent(MoveController).speed);
/*晃动
	if (timer > playGap/2) {
		firstPersonTarget.GetComponent(WobblePlayer).ifWobble = false;
	}
晃动*/
	if ((timer > playGap)&&(walker.GetComponent(MoveController).isGrounded)&&(walker.GetComponent(MoveController).isMoving)) {
		walkPlayer.GetComponent(SoundPlayer).Play(Mathf.Clamp(walker.GetComponent(MoveController).speed/5 , minWalkVolume , maxWalkVolume),theDopplerLevel);
		timer = 0;
//晃动		firstPersonTarget.GetComponent(WobblePlayer).ifWobble = true;
	}
	
}