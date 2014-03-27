#pragma strict
@HideInInspector
var ifKeepUp = true;
var autoSlideValue = 0.2;

function Start () {

}

function Update () {
//保持rigidbody无位置运动影响
	if (Mathf.Abs(rigidbody.velocity.x) > autoSlideValue) rigidbody.velocity.x = 0;
	if (Mathf.Abs(rigidbody.velocity.z) > autoSlideValue) rigidbody.velocity.z = 0;
//保持rigidbody总是无转向影响
	if (ifKeepUp) {
		rigidbody.constraints = RigidbodyConstraints.FreezeRotationX | RigidbodyConstraints.FreezeRotationY | RigidbodyConstraints.FreezeRotationZ;
	}
	/*else {
		rigidbody.constraints = RigidbodyConstraints.None;
//恢复正常状态	
		if (Input.GetAxis("BackToNormal")) {
			transform.localEulerAngles.x = 0;
			transform.localEulerAngles.z = 0;
		}
	}*/
	
}