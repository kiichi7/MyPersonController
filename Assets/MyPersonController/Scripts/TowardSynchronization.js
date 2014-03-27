//关联物体
var myCharacter : GameObject;
var myCamera : GameObject;
private var moveController : MoveController;
private var cameraController : CameraController;
enum SynchronousMode {NoSynchronous = 0, EntirelySynchronous = 1, CharacterToCamera = 2, CameraToCharacter = 3};
var firstPersonSynchronization : SynchronousMode = SynchronousMode.EntirelySynchronous;
var thirdPersonSynchronization : SynchronousMode = SynchronousMode.NoSynchronous;
private var towardSynchronization : SynchronousMode;
private var characterPriority = true;

//0~
var synchronizationTime = 0.5;

function Start () {

	moveController = myCharacter.GetComponent(MoveController);
	cameraController = myCamera.GetComponent(CameraController);

}

function Update () {
	
	if (cameraController.is1stPerson) towardSynchronization = firstPersonSynchronization;
	else towardSynchronization = thirdPersonSynchronization;
	
	switch (towardSynchronization) {
		case 0: 
			break;
		case 1: 
			if (Input.GetAxis("Circling") != 0) characterPriority = true;
			else if (Input.GetAxis("Mouse X") != 0) characterPriority = false;
			if (characterPriority) ChangeCameraToCharacter();
			else ChangeCharacterToCamera();
			break;
		case 2: 
			ChangeCharacterToCamera();
			break;
		case 3: 
			ChangeCameraToCharacter();
			break;
		default:
			break;
	}
	
	

}

function ChangeCameraToCharacter() {

	cameraController.mouseX = ChangeXToY(cameraController.mouseX, moveController.transform.rotation.eulerAngles.y);

}

function ChangeCharacterToCamera () {

	if (moveController.canControl) moveController.transform.rotation.eulerAngles.y = ChangeXToY(moveController.transform.rotation.eulerAngles.y, cameraController.mouseX);

}

function ChangeXToY (x : float, y : float) {


	if ((synchronizationTime <= 0)||(cameraController.is1stPerson)) return y;
	else {
		var correctionValue = 0.0;
		if ((y - x) > 180) y-= 360;
		else if ((y - x) < -180) y += 360;
		x += Time.deltaTime * (y - x) / synchronizationTime ;
		return x;
	}
}