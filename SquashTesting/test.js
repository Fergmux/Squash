


test("square exists", function(){
	ok(square,"square exists")
})

test("square is function", function(){ 
	ok(typeof square == 'function', "square is a function")
})

test("square returns", function(){
	for(var i = 0; i < 12; i++){
	equal(square(i),i*i,"Argument of "+i+" returned "+i*i)
	}
})

test("return err", function(){
	equal(square("this is a string"),"not number","return string")
})

/* --------------------------------------------------------------------------------------------*/

test(" function login exists", function() {
	ok(login, "login exists")
})

/* --------------------------------------------------------------------------------------------*/

test(" function loadUserData exists", function() {
	ok(loadUserData, "loadUserData exists")
})

/* --------------------------------------------------------------------------------------------*/

test("function loginTap exists", function(){
	ok(loginTap, "loginTap exists")
})

/* --------------------------------------------------------------------------------------------*/

test("function getPlayerInfo exists", function(){
	ok(getPlayerInfo, "getPlayerInfo exists")
})

/* --------------------------------------------------------------------------------------------*/

test("function displayProfile exists", function(){
	ok(displayProfile, "displayProfile exists")
})

/* --------------------------------------------------------------------------------------------*/

test("function load exists", function(){
	ok(load, "load exists")
})

/* --------------------------------------------------------------------------------------------*/

test("function getKey exists", function(){
	ok(getKey,"getKey exists")
})

/* --------------------------------------------------------------------------------------------*/

test("function createAutoList exists", function(){
	ok(createAutoList, "createAutoList exists")

})

/* --------------------------------------------------------------------------------------------*/

test("function createPlayerIdArray", function(){
	ok(createPlayerIdArray, "createPlayerIdArray exists")
})

/* --------------------------------------------------------------------------------------------*/

test("function loadPlayerList", function(){
	ok(loadPlayerList, "loadPlayerList exists")
})

/* --------------------------------------------------------------------------------------------*/
test("function onTap", function(){
	ok(onTap, "onTap exists")
})

/* --------------------------------------------------------------------------------------------*/

test("function toggleFilters", function(){
	ok(toggleFilters, "toggleFilters exists")
})

/* --------------------------------------------------------------------------------------------*/

test("function displayRank", function(){
	ok(displayRank, "displayRank exists")
})

/* --------------------------------------------------------------------------------------------*/

test("function tapped", function(){
	ok(tapped, "tapped exists")
})

/* --------------------------------------------------------------------------------------------*/

test("function changeHiddenInput", function(){
	ok(changeHiddenInput, "changeHiddenInput exists")
})

/* --------------------------------------------------------------------------------------------*/

test("function loadRanking", function(){
	ok(loadRanking, "loadRanking exists")
})

/* --------------------------------------------------------------------------------------------*/

test("function setDateInput", function(){
	ok(loadRanking, "setDateInput exists")
})

/* --------------------------------------------------------------------------------------------*/

 test("function loadnames exists", function(){
	ok(loadnames, "loadnames exists")
})

 /* --------------------------------------------------------------------------------------------*/

 test("function makePlayerArray exists", function(){
	ok(makePlayerArray, "makePlayerArray exists")
})

 /* --------------------------------------------------------------------------------------------*/

 test("function check1Score exists", function(){
	ok(check1Score, "check1Score exists")
})
 /* --------------------------------------------------------------------------------------------*/

test("function check2Score exists", function(){
	ok(check2Score, "check2Score exists")
})

 /* --------------------------------------------------------------------------------------------*/

 test("function check3Score exists", function(){
	ok(check3Score, "check3Score exists")
})

 /* --------------------------------------------------------------------------------------------*/

 test("function check4Score exists", function(){
	ok(check4Score, "check4Score exists")
})

 /* --------------------------------------------------------------------------------------------*/

 test("function check5Score exists", function(){
  	ok(check5Score, "check5Score exists")
 })

 /* --------------------------------------------------------------------------------------------*/

 test("function updateRounds exists", function(){
  	ok(updateRounds, "updateRounds exists")
  })

 /* --------------------------------------------------------------------------------------------*/

test("function submitScores exists", function(){
  	ok(submitScores, "submitScores exists")
  })

/* --------------------------------------------------------------------------------------------*/

 test("function checkNames exists", function(){
  	ok(checkNames, "checkNames exists")
  })

/* --------------------------------------------------------------------------------------------*/

 test("function popAlert exists", function(){
  	ok(popAlert, "popAlert exists")
  })

/* --------------------------------------------------------------------------------------------*/

 test("function clearPage exists", function(){
  	ok(popAlert, "clearPage exists")
  })

/* --------------------------------------------------------------------------------------------*/

test("function clearCache exists", function(){
  	ok(clearCache, "clearCache exists")
  })

/* --------------------------------------------------------------------------------------------*/

test("function logout exists", function(){
  	ok(logout, "logout exists")
  })

 /* --------------------------------------------------------------------------------------------*/

test("function percChange exists", function(){
  	ok(percChange, "percChange exists")
  })

  /* --------------------------------------------------------------------------------------------*/ //// check this /////

 test("function percChange returns correct result for no change integers", function(){
 	equal(percChange(100,100),"+0.00%", "Argument of 100,100 returned +0 ")
 })

test("function percChange returns correct result for negative integers", function(){
 	equal(percChange(200,100),"-50.00%", "Argument of 200,100 returned -100 ")
 })

test("function percChange returns correct result for positive integers", function(){
 	equal(percChange(100,200),"+100.00%", "Argument of 100,200 returned -100 ")
 })

/* --------------------------------------------------------------------------------------------*/

test("function format_date exists", function(){
  	ok(format_date, "format_date exists")
  })

test("function format returns correct result", function(){
 	equal(format_date(1459807171050),"4/4/2016", "Argument of 1459806349159 returned 4th april ") //check this needs extra month. clock starts january 
 })

  /* --------------------------------------------------------------------------------------------*/

test("function readmatch exists", function(){
	ok(readmatch, "readmatch exists")
})

  /* --------------------------------------------------------------------------------------------*/

test(" function chartData exists", function(){
	ok(chartData, "chartData exists")
})

  /* --------------------------------------------------------------------------------------------*/

test(" function drawChart exists", function(){
	ok(drawChart, "drawChart exists")
})

  /* --------------------------------------------------------------------------------------------*/

test(" function display exists", function(){
	ok(display, "display exists")
})

 /* --------------------------------------------------------------------------------------------*/

test(" function displayMatch exists", function(){
	ok(displayMatch, "displayMatch exists")
})







