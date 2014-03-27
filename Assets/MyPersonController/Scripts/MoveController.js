//可控选择
var ifVerticalMoveAllowed = true;
var ifHorizontalMoveAllowed = true;
var ifCirclingMoveAllowed = true;
var ifJumpAllowed = true;
var ifSlowWalkAllowed = true;
//可控选择状态
@HideInInspector
var verticalMoveAllowed = true;
@HideInInspector
var horizontalMoveAllowed = true;
@HideInInspector
var circlingMoveAllowed = true;
@HideInInspector
var jumpAllowed = true;
//移动控制
var onlyGroudedControl = true;
private var horizontalSpeed = 0.0;
private var verticalSpeed = 0.0;
private var gravitySpeed = 0.0;
private var circlingSpeed = 0.0;
private var groundedTimer = 0.0;
private var isSlowWaking = false;
@HideInInspector
var isGrounded = true;
@HideInInspector
var lastGrounded = true;
@HideInInspector
var canControl = true;
//域值
var minForwardSpeed = 1.0;
var maxForwardSpeed = 5.0;
var minBackSpeed = 1.0;
var maxBackSpeed = 2.0;
var minSideSpeed = 1;
var maxSideSpeed = 2.0;
var minTurnSpeed = 0.1;
var maxTurnSpeed = 1.0;
var upMoveSpeed = 1.0;
var downMoveSpeed = 3.0;
var upTurnSpeed = 1;
var downTurnSpeed = 5;
//跳跃控制
var airJump = false;
var jumpGap = 0.2;
var minJumpSpeed = 1.0;
var maxJumpSpeed = 10.0;
var jumpPower = 100.0;
private var gravity = -9.81;
private var canJump = true;
private var lastJump = 0.0;
//预测偏移判断变量
//private var predictPosition : Vector3;
//private var deviationDirection : Vector3;
//碰撞情况
private var collisionNormal : Vector3;
//private var collisionVelocity : Vector3;
//状态
var hinderJudgeValue = 0.5;
var groundJudgeValue = -0.2;
//运动状态
@HideInInspector
var isMoving : boolean;
private var moveDirection : Vector3 = Vector3.zero;
private var moveRotation : Vector3 = Vector3.zero;
@HideInInspector
var speed = 0.0;

function Start() {

	gravity = Physics.gravity.y;
	verticalMoveAllowed = ifVerticalMoveAllowed;
	horizontalMoveAllowed = ifHorizontalMoveAllowed;
	circlingMoveAllowed = ifCirclingMoveAllowed;
	jumpAllowed = ifJumpAllowed;

}


function FixedUpdate() {

//碰撞值转化
	collisionNormal = transform.InverseTransformDirection(collisionNormal);
	
//之前的着地状态
	lastGrounded = isGrounded;

//判断是否着地
	isGrounded = rigidbody.velocity.y > groundJudgeValue;

//判断是否运动
   	isMoving = ((horizontalSpeed != 0)||(verticalSpeed != 0)||(circlingSpeed != 0));

//判断是否能够控制
	canControl = (((onlyGroudedControl)&&(isGrounded))||(!onlyGroudedControl)||(moveDirection == Vector3.zero));
	
	
//慢行状态
	isSlowWaking = ((ifSlowWalkAllowed)&&(Input.GetButton("SlowWalk")));	
	
//控制代码
	if (canControl) {
	
//垂直速度控制
		if (verticalMoveAllowed) {
			if ((Input.GetAxis("Vertical") > 0)&&(verticalSpeed >= 0)) {
				if ((verticalSpeed < minForwardSpeed)||(isSlowWaking)) verticalSpeed = minForwardSpeed;
				else if (verticalSpeed < maxForwardSpeed) verticalSpeed += 2*upMoveSpeed*Time.deltaTime;
			}
			else if ((Input.GetAxis("Vertical") < 0)&&(verticalSpeed <= 0)) {
				if ((verticalSpeed > -minBackSpeed)||(isSlowWaking)) verticalSpeed = -minBackSpeed;
				else if (verticalSpeed > -maxBackSpeed) verticalSpeed -= 2*upMoveSpeed*Time.deltaTime;
			}
			else {
				if (verticalSpeed > 0) {
					verticalSpeed -= downMoveSpeed*Time.deltaTime;
					if (verticalSpeed < 0) verticalSpeed = 0;
				}
				else if (verticalSpeed < 0) {
					verticalSpeed += downMoveSpeed*Time.deltaTime;
					if (verticalSpeed > 0) verticalSpeed = 0;
				}
			}
		}
		
//水平速度控制
		if (horizontalMoveAllowed) {
			if ((Input.GetAxis("Horizontal") > 0)&&(horizontalSpeed >= 0)) {
				if ((horizontalSpeed < minSideSpeed)||(isSlowWaking)) horizontalSpeed = minSideSpeed;
				else if (horizontalSpeed < maxSideSpeed) horizontalSpeed += 2*upMoveSpeed*Time.deltaTime;
			}
			else if ((Input.GetAxis("Horizontal") < 0)&&(horizontalSpeed <= 0)) {
				if ((horizontalSpeed > -minSideSpeed)||(isSlowWaking)) horizontalSpeed = -minSideSpeed;
				else if (horizontalSpeed > -maxSideSpeed) horizontalSpeed -= 2*upMoveSpeed*Time.deltaTime;
			}
			else {
				if (horizontalSpeed > 0) horizontalSpeed -= downMoveSpeed*Time.deltaTime;
				else if (horizontalSpeed < 0) horizontalSpeed += downMoveSpeed*Time.deltaTime;
			}
		}
		
//旋转速度控制
		if (circlingMoveAllowed) {
			if ((Input.GetAxis("Circling") > 0)&&(circlingSpeed >= 0)) {
				if ((circlingSpeed < minTurnSpeed)||(isSlowWaking)) circlingSpeed = minTurnSpeed;
				else if (circlingSpeed < maxTurnSpeed) circlingSpeed += 2*upTurnSpeed*Time.deltaTime;
			}
			else if ((Input.GetAxis("Circling") < 0)&&(circlingSpeed <= 0)) {
				if ((circlingSpeed > -minTurnSpeed)||(isSlowWaking)) circlingSpeed = -minTurnSpeed;
				else if (circlingSpeed > -maxTurnSpeed) circlingSpeed -= 2*upTurnSpeed*Time.deltaTime;
			}
			else {
				if (circlingSpeed > 0) {
					circlingSpeed -= downTurnSpeed*Time.deltaTime;
					if (circlingSpeed < 0) circlingSpeed = 0;
				}
				else if (circlingSpeed < 0) {
					circlingSpeed += downTurnSpeed*Time.deltaTime;
					if (circlingSpeed > 0) circlingSpeed = 0;
				}
			}
		}
	}
	else {
		if (circlingMoveAllowed) {
			if (circlingSpeed > 0) {
				circlingSpeed -= downTurnSpeed*Time.deltaTime;
				if (circlingSpeed < 0) circlingSpeed = 0;
			}
			else if (circlingSpeed < 0) {
				circlingSpeed += downTurnSpeed*Time.deltaTime;
				if (circlingSpeed > 0) circlingSpeed = 0;
			}
		}
	}

//跳跃控制
	if (jumpAllowed) {
		if (canJump) {
			if (Input.GetButton ("Jump")) {
				if (gravitySpeed < minJumpSpeed) gravitySpeed = minJumpSpeed;	
				gravitySpeed += (jumpPower - gravity)* Time.deltaTime;
				if (gravitySpeed > maxJumpSpeed) {
					gravitySpeed = maxJumpSpeed;				
					if (!airJump) canJump = false;
				}
			}
			else if (!airJump) canJump = false;
		}
		else {
			gravitySpeed += gravity * Time.deltaTime;	
			if ((isGrounded)&&(gravitySpeed < 0)) {
				gravitySpeed = 0;
				jumpStatus = 2;
				if ((Time.time - lastJump) > jumpGap) canJump = true;
			}
			else lastJump = Time.time;
		}
	}
	
//判断碰撞速度陡转
	if (Mathf.Abs(collisionNormal.x) > hinderJudgeValue) horizontalSpeed = 0;
	if (Mathf.Abs(collisionNormal.z) > hinderJudgeValue) verticalSpeed = 0;
	if (collisionNormal.y < -0.2) {
		canJump = false;
		gravitySpeed = 0;
		rigidbody.velocity.y = -0.2;
	}
	else if (collisionNormal.y > 0.2) {
		rigidbody.velocity.y = 0;
		}
//运动数值转化  	
		moveDirection = Vector3(horizontalSpeed, gravitySpeed, verticalSpeed);
		moveDirection = transform.TransformDirection(moveDirection);
		transform.position += moveDirection * Time.deltaTime;
	    transform.Rotate(Vector3(0, 100 * circlingSpeed * Time.deltaTime, 0));
	    
//当前速度
		speed = Mathf.Max(Mathf.Abs(horizontalSpeed),Mathf.Abs(verticalSpeed));
	    
//预测偏移判断数据获取
//	    predictPosition = transform.position + moveDirection * Time.deltaTime;

//	预测偏移判断是非有碰撞
/*	deviationDirection = transform.position - predictPosition;
	deviationDirection = transform.InverseTransformDirection(deviationDirection);

	deviationDirection.x /= 0.02 * maxSideSpeed;
	deviationDirection.x += horizontalSpeed/maxSideSpeed;

	if (deviationDirection.z > 0) {
		deviationDirection.z /= 0.02 * maxBackSpeed;
		deviationDirection.z += verticalSpeed/maxBackSpeed;
	}
	else {
		deviationDirection.z /= 0.02 * maxForwardSpeed;
		deviationDirection.z += verticalSpeed/maxForwardSpeed;
	}

	Debug.Log("deviationDirection: " + deviationDirection);
*/

}


function BooleanToFloat(theValue : boolean) {
	if (theValue) return (1.0);
	else return (0.0);
}


function OnCollisionEnter(collision : Collision) {

	collisionNormal = collision.contacts[0].normal;
	//collisionVelocity = collision.relativeVelocity;
	
}


function OnCollisionStay(collision : Collision) {

	collisionNormal = collision.contacts[0].normal;
	//collisionVelocity = collision.relativeVelocity;

}


function OnCollisionExit(collision : Collision) {

	collisionNormal = Vector3.zero;
	//collisionVelocity = Vector3.zero;

}