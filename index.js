/// index.js

import {Tiles ,Entities,tileMap01} from './SokobanBase.js';
var blockInGoalArea = 0;
var possibleToMoveBlock = true;

///
document.addEventListener('keydown', checkKey);

let playerCoordinates={   //player Coordinates in the map
    axis_X:11,axis_Y:11,
};

function idCreator(x, y) {
	return 'x' + x + 'y' + y;
}
  
function initiateMap(map){              //to initiate the map of items, grid
    sokobanPlan.style.display = "grid";
    
	let xColumn = " ";
	let yRow = " ";
	for (let x = 0; x < map.width; x++) 
		xColumn = xColumn + 3.7 +"em " ;
	for (let y1 = 0; y1 < map.height; y1++)
		yRow = yRow + 3.7+ "em ";

    sokobanPlan.style.gridTemplateColumns = xColumn;
	sokobanPlan.style.gridTemplateRows = yRow;
}

drawSokoban(tileMap01);

function drawSokoban(map)  ///  drow map
{
    const container = document.getElementById("container");  //game
    const sokobanPlan = document.getElementById("sokobanPlan");  // map area
	
	container.style.width = map.width * 3.7 + "em "; // suitable for the size of the image
	container.style.height = map.height * 3.7 + "em ";
    	// Setup the grid
    initiateMap(map);

    // Fill the grid with game tiles
	    for (let x = 1; x < map.height; x++)  // ignoring the first empty  line of spaces by start from x=1
		for (let y = 0; y < map.width; y++)
        {
            let cell = map.mapGrid[x][y][0];
			const gameTile = document.createElement("div");
			gameTile.setAttribute("id", idCreator(y, x));

            if(cell === " ")
             gameTile.classList.add(Tiles.Space);
            else if(cell === "W")
             gameTile.classList.add(Tiles.Wall);
            else if (cell === "B")
            {
             gameTile.classList.add(Tiles.Space);
             gameTile.classList.add(Entities.Block);
            }
            else if (cell === "G")
             gameTile.classList.add(Tiles.Goal);
            else if(cell === "P")
            {
             gameTile.classList.add(Entities.Character);
             playerCoordinates.axis_X=x;
             playerCoordinates.axis_Y=y;

            }
                sokobanPlan.appendChild(gameTile);
        }
}

function checkKey(event)  //  get the arrowkey control 
{
    event.preventDefault();
	if (event.keyCode =='37') //leftkey
    movePlayer(-1,0);
	if (event.keyCode=='38')  //upkey
        movePlayer(0,-1); 
	if (event.keyCode=='39') //rightkey
    movePlayer(1,0);
	if (event.keyCode=='40') //downkey
    movePlayer(0,1);
}

function movePlayer(movePositionX,movePositionY)
{
        let currentPostionPlayer= document.getElementById(idCreator(playerCoordinates.axis_X,playerCoordinates.axis_Y));
        let NewPostionPlayer = document.getElementById(idCreator(playerCoordinates.axis_X+movePositionX, playerCoordinates.axis_Y+movePositionY));
	
    if (NewPostionPlayer.classList.contains(Tiles.Wall)) // wall on the next step ,not moving
           return;
       else if(NewPostionPlayer.classList.contains(Entities.Block))   ///Character push the block 
       {
            pushBlock(playerCoordinates.axis_X+movePositionX,playerCoordinates.axis_Y+movePositionY,movePositionX,movePositionY);
           if (possibleToMoveBlock)
           {
           currentPostionPlayer.classList.remove(Entities.Character);
           NewPostionPlayer.classList.add(Entities.Character);
    	   playerCoordinates.axis_X += movePositionX;
    	   playerCoordinates.axis_Y += movePositionY;
           }
        } 
        else if(NewPostionPlayer.classList.contains(Entities.BlockDone))   ///Character push the block 
        {
             pushBlock(playerCoordinates.axis_X+movePositionX,playerCoordinates.axis_Y+movePositionY,movePositionX,movePositionY);
            if (possibleToMoveBlock)
            {
            currentPostionPlayer.classList.remove(Entities.Character);
            NewPostionPlayer.classList.add(Entities.Character);
            playerCoordinates.axis_X += movePositionX;
            playerCoordinates.axis_Y += movePositionY;
            }
         }
       else  // for the Character to move in space 
       { 
    	currentPostionPlayer.classList.remove(Entities.Character); 
        NewPostionPlayer.classList.add(Entities.Character );
    	playerCoordinates.axis_X += movePositionX;
	    playerCoordinates.axis_Y += movePositionY;
       }        
}

function pushBlock(playerPosX,playerPosY,positionX,positionY)
{
    possibleToMoveBlock = true;
    let currentPostionBlock= document.getElementById(idCreator(playerPosX,playerPosY));
    let NewPostionBlock = document.getElementById(idCreator(playerPosX+positionX,playerPosY+positionY));

    if(NewPostionBlock.classList.contains(Tiles.Wall)) // if it's a Wall after the block
    return (possibleToMoveBlock = false);
    
    else if(NewPostionBlock.classList.contains(Entities.Block)) // if it's a block after the block
    return (possibleToMoveBlock = false);

    else if(NewPostionBlock.classList.contains(Entities.BlockDone))
    {
        currentPostionBlock.classList.replace(Entities.BlockDone);
        return (possibleToMoveBlock = true);
    }
     /// here to get block to goal 
    else if(currentPostionBlock.classList.contains(Tiles.Space) && NewPostionBlock.classList.contains(Tiles.Goal))
    {
        currentPostionBlock.classList.remove(Entities.Block);
        NewPostionBlock.classList.add(Entities.BlockDone);
        blockInGoalArea++;
        if(blockInGoalArea === 6)
        window.confirm("You win");
        return (possibleToMoveBlock = true);
    }
       /// here to push BlockDone
     else if (currentPostionBlock.classList.contains(Entities.BlockDone) && NewPostionBlock.classList.contains(Tiles.Goal))
    {
        currentPostionBlock.classList.remove(Entities.BlockDone);
        NewPostionBlock.classList.add(Entities.BlockDone);
        return (possibleToMoveBlock = true);
    }
    else  //here the blcok can move
    {
        currentPostionBlock.classList.remove(Entities.Block);  
        NewPostionBlock.classList.add(Entities.Block);
    }
}


