function getCookie(name) {
    var v = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
    return v ? v[2] : null;
}

// Get incoming invites
// var pageIndex = 0;
// var pageSize = 12;
// var url = `${siteMaster.scApiBase}/friends/getInvites?onlineService=sc&nickname=&pageIndex=${pageIndex}&pageSize=${pageSize}`;
// var method = 'GET';

// Get outgoing invites
// var pageIndex = 0;
// var pageSize = 12;
// var url = `${siteMaster.scApiBase}/friends/getInvitesSent?onlineService=sc&nickname=&pageIndex=${pageIndex}&pageSize=${pageSize}`;
// var method = 'GET';

// Get active friends
// var pageIndex = 0;
// var pageSize = 12;
// var url = `${siteMaster.scApiBase}/friends/getFriendsFiltered?onlineService=sc&nickname=&pageIndex=${pageIndex}&pageSize=${pageSize}`;
// var method = 'GET';

// Cancel outgoing invite
// var rockstarId = '';
// var url = `${siteMaster.scApiBase}/friends/cancelInvite?rockstarId=${rockstarId}&isMyOwnInvite=true`;
// var method = 'POST';

// Cancel incoming invite
// var rockstarId = '';
// var url = `${siteMaster.scApiBase}/friends/cancelInvite?rockstarId=${rockstarId}&isMyOwnInvite=false`;
// var method = 'POST';

// Remove friend
// var rockstarId = '';
// var url = `${siteMaster.scApiBase}/friends/remove?rockstarId=${rockstarId}`;
// var method = 'POST';

// Block player
// var rockstarId = '';
// var url = `${siteMaster.scApiBase}/friends/blockPlayer?rockstarId=${rockstarId}`;
// var method = 'POST';

// Unblock player
// var rockstarId = '';
// var url = `${siteMaster.scApiBase}/friends/unblockPlayer?rockstarId=${rockstarId}`;
// var method =  'POST';

// Search for users containing {searchTerm}
// var searchTerm = '';
// var url = `${siteMaster.scApiBase}/search/user?service=sc&searchTerm=${searchTerm}`;
// var method =  'GET';

function DoRequest(object) {
    try {
        var bearerToken = GetCookie(siteMaster.scauth.tokenCookieName);
        var scApiRequestOptions = {
            method: object.method,
            credentials: 'same-origin',
            cache: 'default',
            mode: 'cors',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'X-Lang': 'en-US',
                'X-Cache-Ver': '10',
                'Authorization': `Bearer ${bearerToken}`
            }
        };
    
        fetch(object.url, scApiRequestOptions)
            .then(response => response.json())
            .then(json => object.success(json))
            .catch(error => object.error(error))
    } catch (error) {
        object.error(error);
    }    
}