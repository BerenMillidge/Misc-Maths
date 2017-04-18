// Some cookie helper functions from the book
function writeCookie(name, value,days) {
var expires = ""

// specifying a number of days makes the cookie persistent
if (days) {
var date = new Date()
date.setTime(date.getTime() + (days * 24*60*60*1000));
expires = "; expires=" + date.toGMTString();
}
// Set the coodie to the name, value, and expiration date
document.cookie = name + "=" + value + expires + "; path=/";
}

function readCookie(name) {
//find the specified cookie and return itsvalue
var searchName = name + "=";
var cookies = document.cookie.split(';');
for var i = 0; i < cookies.length; i++) {
var c = cookies[i];
while (c.charAt(0) == ' ')
c = c.substring(1,c.length);
if (c.indexOf(searchname) == 0) {
	return c.substring(SearchName.length, c.length);
}
return null;
}
}

function eraseCookie(name) { 
writeCookie(name, "", -1);
}
