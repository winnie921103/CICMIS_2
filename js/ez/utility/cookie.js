var caution = false

function setCookie(name, value) {
	var argv=arguments
	var argc=arguments.length
	var expires = (argc > 2) ? argv[2] : null
	var path = (argc > 3) ? argv[3] : null
	var domain = (argc > 4) ? argv[4] : null
	var secure = (argc > 5) ? argv[5] : false
	var curCookie = name + "=" + escape(value) + ((expires) ? "; expires=" + expires.toGMTString() : "") +
		((path) ? "; path=" + path : "") + ((domain) ? "; domain=" + domain : "") + ((secure) ? "; secure" : "")
	if (!caution || (name + "=" + escape(value)).length <= 4000) document.cookie = curCookie
	else if (confirm("Cookie exceeds 4KB and will be cut!")) document.cookie = curCookie
}

function getCookie(name) {
	var prefix = name + "="
	var cookieStartIndex = document.cookie.indexOf(prefix)
	if (cookieStartIndex == -1) return null
	var cookieEndIndex = document.cookie.indexOf(";", cookieStartIndex + prefix.length)
	if (cookieEndIndex == -1) cookieEndIndex = document.cookie.length
	return unescape(document.cookie.substring(cookieStartIndex + prefix.length, cookieEndIndex))
}

function deleteCookie(name) {
	var argv=arguments
	var argc=arguments.length
	var path = (argc > 1) ? argv[1] : null
	var domain = (argc > 2) ? argv[2] : null
	if (getCookie(name)) {
		document.cookie = name + "=" + ((path) ? "; path=" + path : "") +
		((domain) ? "; domain=" + domain : "") + "; expires=Thu, 01-Jan-70 00:00:01 GMT"
	}
}

function fixDate(date) {
	var base = new Date(0)
	var skew = base.getTime()
	if (skew > 0) date.setTime(date.getTime() - skew)
}
