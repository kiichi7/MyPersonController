//关联物体
var firstPersonTarget : Transform;
var thirdPersonTarget : Transform;
private var cameraTarget : Transform;
var myBody : Transform;

//可控选择
var ifHorizontalAllowed = true;
var ifVerticalAllowed = true;
var ifRollAllowed = true;
//可控选择状态
@HideInInspector
var verticalAllowed : boolean;
@HideInInspector
var horizontalAllowed : boolean;
@HideInInspector
var rollAllowed : boolean;
//控制相关
@HideInInspector
var mouseX = 0.0;
private var mouseY = 0.0;
private var x = 0.0;
private var y = 0.0;
//一、中心水平垂直速度
var whirlSpeed = 3.0;
var minWhirlValue = 10;
var whirlDrag = 0.1;
var exceedBackTime = 0.1;
//1、水平中心滚动
// 0~360
var min3rdPersonHorizontalAngle = 0;
var max3rdPersonHorizontalAngle = 360;
var exceedHorizontalAngleRange = true;
var invertHorizontalMouse = false; 
//如果该项为真，则上面设置范围无效
var full360 = true;
//2、垂直中心滚动
// -180~180
var min1stPersonVerticalAngle = -90;
var max1stPersonVerticalAngle = 90;
// -180~180
var min3rdPersonVerticalAngle = 5;
var max3rdPersonVerticalAngle = 85;
var exceedVerticalAngleRange = true;
var invertVerticalMouse = false;
//二、面向中心缩进
private var distance = 10.0;
private var p = 0.0;
private var firstPersonDistance = 0.0;
var rollSpeed = 0.3;
var rollDrag = 0.01;
//1、面向缩进滚动
// >0
var minRollDistance = 0.0;
var maxRollDistance = 100.0; 
var invertRollWheel = false; 
//一三人成判断
@HideInInspector
var is1stPerson = false;

function Start () {
	
	if (min1stPersonVerticalAngle > max1stPersonVerticalAngle) min1stPersonVerticalAngle = max1stPersonVerticalAngle;
	if (min3rdPersonVerticalAngle > max3rdPersonVerticalAngle) min3rdPersonVerticalAngle = max3rdPersonVerticalAngle;
	if (min3rdPersonHorizontalAngle > max3rdPersonHorizontalAngle) min3rdPersonHorizontalAngle = max3rdPersonHorizontalAngle;
	if (minRollDistance > maxRollDistance) minRollDistance = maxRollDistance;
	horizontalAllowed = ifHorizontalAllowed;
	verticalAllowed = ifVerticalAllowed;
	rollAllowed = ifRollAllowed;
	if (full360) {
		min3rdPersonHorizontalAngle = 0;
		max3rdPersonHorizontalAngle = 360;
	}

}


function FixedUpdate () {

//运算第一人称判断距离
	firstPersonDistance = Mathf.Max(Mathf.Max(myBody.transform.localScale.x , myBody.transform.localScale.y) , myBody.transform.localScale.z) + camera.nearClipPlane;
	is1stPerson = (distance < firstPersonDistance);
	
//摄像机朝向目标切切换
	if (is1stPerson) cameraTarget = firstPersonTarget;
	else cameraTarget = thirdPersonTarget;

//水平左右围绕中心旋转操作
	if (horizontalAllowed) {
		if ((is1stPerson)||(min3rdPersonHorizontalAngle < max3rdPersonHorizontalAngle)) {
	        if (Input.GetAxis("Mouse X") == 0) {
	        	if (x > whirlDrag) x -= whirlDrag;
	        	else if (x >= -whirlDrag) x = 0;
	        	else x += whirlDrag;
	        }
	        else {
	        	if (!invertHorizontalMouse) x += Input.GetAxis("Mouse X");
	        	else x -= Input.GetAxis("Mouse X");
	        }
	        x = Mathf.Clamp(x,-whirlSpeed,whirlSpeed);
		    mouseX += x * Mathf.Sqrt(minWhirlValue)/ 5;
			if (!is1stPerson) {
		        if (exceedHorizontalAngleRange) {
				    mouseX = MyClamp(mouseX, min3rdPersonHorizontalAngle, max3rdPersonHorizontalAngle);
			    }
			    else {
				    mouseX = Mathf.Clamp(mouseX, min3rdPersonHorizontalAngle, max3rdPersonHorizontalAngle);
			    }
		    }
		    if (full360) {mouseX = mouseX % 360;
		    	if (mouseX < 0) mouseX += 360;
		    }
		    
	    }
	    else {
	    	mouseX = max3rdPersonHorizontalAngle;
	    }
	}
	
//垂直上下围绕中心操作
	if (verticalAllowed) {
		if (((is1stPerson)&&(min1stPersonVerticalAngle < max1stPersonVerticalAngle))||(min3rdPersonVerticalAngle < max3rdPersonVerticalAngle)) {
	        if (Input.GetAxis("Mouse Y") == 0) {
	        	if (y > whirlDrag) y -= whirlDrag;
	        	else if (y >= -whirlDrag) y = 0;
	        	else y += whirlDrag;
	        }
	        else {
	        	if (!invertVerticalMouse) y += Input.GetAxis("Mouse Y");
	        	else y -= Input.GetAxis("Mouse Y");
	        }
			y = Mathf.Clamp(y,-whirlSpeed,whirlSpeed);
			mouseY = (mouseY - y * Mathf.Sqrt(minWhirlValue)/ 5)%360;
	        if (mouseY < 180) mouseY += 360;
	       	if (mouseY > 180) mouseY -= 360;
	       	if (exceedVerticalAngleRange) {
			    if (is1stPerson) mouseY = MyClamp(mouseY, min1stPersonVerticalAngle, max1stPersonVerticalAngle);
			    else mouseY = MyClamp(mouseY, min3rdPersonVerticalAngle, max3rdPersonVerticalAngle);
		    }
		    else {
			    if (is1stPerson) mouseY = Mathf.Clamp(mouseY, min1stPersonVerticalAngle, max1stPersonVerticalAngle);
			    else mouseY = Mathf.Clamp(mouseY, min3rdPersonVerticalAngle, max3rdPersonVerticalAngle);
		    }
	    }
	    else {
	    	if (is1stPerson) mouseY = max1stPersonVerticalAngle;
	    	else mouseY = max3rdPersonVerticalAngle;
	    }
	}
	
//滚动来回面向中心操作   
	if (rollAllowed) {   
	    if (minRollDistance < maxRollDistance) {
	       	if (Input.GetAxis("Mouse ScrollWheel") == 0) {
	        	if (p > rollDrag) p -= rollDrag;
	        	else if (p >= -rollDrag) p = 0;
	        	else p += rollDrag;
	        }
	        else {
	        	if (!invertRollWheel) p += Input.GetAxis("Mouse ScrollWheel");
	        	else p -= Input.GetAxis("Mouse ScrollWheel");
	        }
	        if (distance < minRollDistance) {p=0; distance=minRollDistance;}
	        else if (distance == minRollDistance) {if (p < 0) p = 0;}
	        else if ((distance < firstPersonDistance)&&(p < 0)) {p = -0.1;}
	        else if (distance == maxRollDistance) {if (p > 0) p = 0;}
	        else if (distance > maxRollDistance) {p=0; distance=maxRollDistance;}
	        distance += p * rollSpeed;
		}
		else distance = maxRollDistance;
	}	

//运动数值转化

        transform.rotation = Quaternion.Euler(mouseY, mouseX, 0);
        transform.position = transform.rotation * Vector3(0.0, 0.0, -distance) + cameraTarget.position;

}


function MyClamp (yValue : float, minValue :float, maxValue : float) {

	if (yValue < minValue) {
		yValue += (minValue-yValue) * Time.deltaTime /exceedBackTime;
		if (yValue > minValue) yValue = minValue;
	}
	else if (yValue > maxValue){
		yValue -= (yValue-maxValue) * Time.deltaTime /exceedBackTime;
		if (yValue < maxValue) yValue = maxValue;
	}
	
	return yValue;

}


function Sq (xValue : float) {
	
	return xValue * xValue;
	
}
