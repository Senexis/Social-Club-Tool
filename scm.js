function Init() {
	var jq = document.createElement('script');
	jq.src = "https://ajax.googleapis.com/ajax/libs/jquery/1.6.3/jquery.min.js";
	document.getElementsByTagName('head')[0].appendChild(jq);

	var sacss = document.createElement('link');
	sacss.rel = "stylesheet";
	sacss.href = "https://cdnjs.cloudflare.com/ajax/libs/sweetalert/1.1.3/sweetalert.min.css";
	document.getElementsByTagName('head')[0].appendChild(sacss);

	var sa = document.createElement('script');
	sa.src = "https://cdnjs.cloudflare.com/ajax/libs/sweetalert/1.1.3/sweetalert.min.js";
	document.getElementsByTagName('head')[0].appendChild(sa);

	if (window.location.href.startsWith("https://socialclub.rockstargames.com/friends")) {
		try {
			var children = [];
			var requestToken = siteMaster.aft.replace('<input name="__RequestVerificationToken" type="hidden" value="', '').replace('" />', '').trim();
			
			setTimeout(function () {
				$('<a class="btn btnGold btnRounded" href="#" id="btnConfirmDeleteAllScript" style="margin-bottom: 8px;">delete all friends</a>').prependTo('#friendsPage');
				$("#btnConfirmDeleteAllScript").click(function(e) {
					e.preventDefault();

					swal({
						allowOutsideClick: true,
						cancelButtonText: "No",
						closeOnConfirm: false,
						confirmButtonColor: "#DD6B55",
						confirmButtonText: "Yes",
						showCancelButton: true,
						text: "All friends will be removed from your friend list.",
						title: "Are you sure?",
						type: "warning",
					},
					function(isConfirm){
						if (isConfirm) {
							$.ajax({
								url: "https://socialclub.rockstargames.com/friends/GetFriendsAndInvitesSentJson?pageNumber=0&onlineService=sc&nickname=&pendingInvitesOnly=false",
								headers: {
									"Accept": "application/json",
									"RequestVerificationToken": requestToken
								},
								error: function(){
									swal("Something went wrong", "Something went wrong while trying to fetch initial data.", "error");
								},
								success: function(data){
									if (data.Status == true) {
										Loop(data);
									} else {
										swal("Something went wrong", "Something went wrong while trying to fetch initial data.", "error");
									}
								}
							});
						} else {
							
						}
					});
				});
				
				$('<a class="btn btnGold btnRounded" href="#" id="btnQuickAddScript" style="margin-bottom: 8px;margin-right: 5px;">quick-add user</a>').prependTo('#friendsPage');
				$("#btnQuickAddScript").click(function(e) {
					e.preventDefault();

					swal({
						allowOutsideClick: true,
						closeOnConfirm: false,
						confirmButtonText: "Add",
						inputPlaceholder: "Social Club username",
						showCancelButton: true,
						text: "Enter the Social Club username to quick-add:",
						title: "Enter username",
						type: "input",
					},
					function(inputValue){
						if (inputValue === false) return false;

						if (inputValue === "") {
							swal.showInputError("The Social Club username field can't be empty.");
							return false
						}

						$.ajax({
							url: "https://socialclub.rockstargames.com/Friends/GetAccountDetails?nickname="+inputValue+"&full=false",
							headers: {
								"Accept": "application/json",
								"RequestVerificationToken": requestToken
							},
							error: function(){
								swal("Something went wrong", "Something went wrong while trying to check whether "+inputValue+" exists or not.", "error");
							},
							success: Add
						});
					});
				});
				
				function Loop(responseData){
					for (var i = 0; i <= responseData.TotalCount / 12; i++) {
						$.ajax({
							url: "https://socialclub.rockstargames.com/friends/GetFriendsAndInvitesSentJson?pageNumber="+i+"&onlineService=sc&nickname=&pendingInvitesOnly=false",
							headers: {
								"Accept": "application/json",
								"RequestVerificationToken": requestToken
							},
							error: function(){
								swal("Something went wrong", "Something went wrong while trying to fetch data from page "+i+".", "error");
							},
							success: function(data){
								if (data.Status == true) {
									data.RockstarAccounts.forEach(function(e){
										children.push(e);
									})
									
									children.forEach(function(e){
										setTimeout(function () {
											Delete(e);
										}, 1000);
									});
								} else {
									swal("Something went wrong", "Something went wrong while trying to fetch data from page "+i+".", "error");
								}
							}
						});
					};
					
					swal("Started removing "+responseData.TotalCount+" friends", "All of your friends are now being removed.\nSee which friends are removed using F12.", "success");
				}
				
				function Add(rockstarObj){
					if (rockstarObj.Status == true) {
						$.ajax({
							url: "https://socialclub.rockstargames.com/friends/UpdateFriend",
							type: "PUT",
							data: '{"id":'+rockstarObj.RockstarId+',"op":"addfriend","custommessage":""}',
							headers: {
								"Content-Type": "application/json",
								"RequestVerificationToken": requestToken
							},
							error: function(){
								swal("Something went wrong", "Something went wrong trying to add " + rockstarObj.Nickname + ".", "error");
							},
							success: function(data){
								if (data.Status == true) {
									swal("User added", "A friend request has been sent to " + rockstarObj.Nickname + ".", "success");
								} else {
									swal("Something went wrong", "Something went wrong trying to add " + rockstarObj.Nickname + ".", "error");
								}
							},
							xhr: function() {
								// No cross-origin header. :-)
								var xhr = jQuery.ajaxSettings.xhr();
								var setRequestHeader = xhr.setRequestHeader;
								
								xhr.setRequestHeader = function(name, value) {
									if (name == 'X-Requested-With') return;
									setRequestHeader.call(this, name, value);
								}

								return xhr;
							}
						});
					} else {
						swal("User not found", "The nickname "+inputValue+" doesn't exist.", "warning");
					}
				}

				function Delete(rockstarObj) {
					$.ajax({
						url: "https://socialclub.rockstargames.com/friends/UpdateFriend",
						type: "PUT",
						data: '{"id":'+rockstarObj.RockstarId+',"op":"delete"}',
						headers: {
							"Content-Type": "application/json",
							"RequestVerificationToken": requestToken
						},
						error: function(){
							swal("Something went wrong", "Something went wrong while trying to remove " + rockstarObj.Name + ".", "error");
						},
						success: function(data){
							if (data.Status == true) {
								console.info("Your " + rockstarObj.Relationship.toLowerCase() + " " + rockstarObj.Name + " has been removed.");
							} else {
								swal("Something went wrong", "Something went wrong while trying to remove " + rockstarObj.Name + ".", "error");
							}
						},
						xhr: function() {
							// No cross-origin header. :-)
							var xhr = jQuery.ajaxSettings.xhr();
							var setRequestHeader = xhr.setRequestHeader;
							
							xhr.setRequestHeader = function(name, value) {
								if (name == 'X-Requested-With') return;
								setRequestHeader.call(this, name, value);
							}

							return xhr;
						}
					});
				}
			}, 1000);
		} catch (err) {
			console.error(err);
		}
	} else {
		swal({
			title: "Wrong site",
			text: "Whoops, you accidentally activated the script on a wrong web page. To use the script, first browse to the correct page, then click the bookmark again.\n\nDo you want to go there now?",
			type: "warning",
			showCancelButton: true,
			cancelButtonText: "No",
			confirmButtonColor: "#DD6B55",
			confirmButtonText: "Yes",
			closeOnConfirm: false
		},
		function(){
			window.location.href = "https://socialclub.rockstargames.com/friends/index";
		});
	}
}