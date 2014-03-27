#pragma strict

var player : GameObject[];
var notes : AudioClip[];
private var playerChooser : int = 0;

function Play (theVolume : float, theDopplerLevel : float) {

	do 
	{ 
		player[playerChooser].audio.clip = notes[Random.Range(0,notes.Length - 1)]; 
	} while (player[(playerChooser + player.Length - 1)%(player.Length)].audio.clip == player[playerChooser].audio.clip);	
		
		player[playerChooser].audio.volume = theVolume;
		player[playerChooser].audio.Play();
		player[playerChooser].audio.dopplerLevel = theDopplerLevel;
		playerChooser = (playerChooser + 1)%(player.Length);
		
}