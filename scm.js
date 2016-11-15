function Init(debug = false, dryrun = false) {
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

	setTimeout(function () {
		if (window.location.href.startsWith("https://socialclub.rockstargames.com/friends")) {
			try {
				var requestToken = siteMaster.aft.replace('<input name="__RequestVerificationToken" type="hidden" value="', '').replace('" />', '').trim();
			} catch (err) {
				console.error("Error retrieving __RequestVerificationToken:\n\n"+err.stack);
				return;
			}

			$('<a class="btn btnGold btnRounded" href="#" id="btnConfirmDeleteAllScript" style="margin-bottom: 8px;">delete all friends</a>').prependTo('#friendsPage');
			$("#btnConfirmDeleteAllScript").click(function(e) {
				e.preventDefault();

				try {
					swal({
						allowEscapeKey: false,
						cancelButtonText: "No",
						closeOnConfirm: false,
						confirmButtonColor: "#DD6B55",
						confirmButtonText: "Yes",
						showCancelButton: true,
						showLoaderOnConfirm: true,
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
								error: function(err){
									if (debug) {
										console.groupCollapsed();
										console.debug("GetFriendsAndInvitesSentJson AJAX incomplete");
										console.debug("\tURL:\t"+this.url);
										console.debug("\tMethod:\t"+this.type);
										console.debug("");
										console.debug("Request:");
										console.debug(this);
										console.debug("");
										console.debug("Response:");
										console.debug(err);
										console.groupEnd();
									};

									swal(err.status+" - "+err.statusText, "Something went wrong while trying to fetch initial data.", "error");
								},
								success: function(data){
									if (debug) {
										console.groupCollapsed();
										console.debug("GetFriendsAndInvitesSentJson AJAX complete");
										console.debug("\tURL:\t"+this.url);
										console.debug("\tMethod:\t"+this.type);
										console.debug("");
										console.debug("Request:");
										console.debug(this);
										console.debug("");
										console.debug("Response:");
										console.debug(data);
										console.groupEnd();
									} 

									if (data.Status == true) {
										RetrieveAll(data);
									} else {
										swal("Something went wrong", "Something went wrong while trying to fetch initial data.", "error");
									}
								}
							});
						} else {
							return;
						}
					});
				} catch (err) {
					console.error("Error during #btnConfirmDeleteAllScript.click():\n\n"+err.stack);
					return;
				}
			});

			$('<a class="btn btnGold btnRounded" href="#" id="btnQuickAddScript" style="margin-bottom: 8px;margin-right: 5px;">quick-add user</a>').prependTo('#friendsPage');
			$("#btnQuickAddScript").click(function(e) {
				e.preventDefault();

				try {
					swal({
						allowEscapeKey: false,
						closeOnConfirm: false,
						confirmButtonText: "Add",
						inputPlaceholder: "Social Club username",
						showCancelButton: true,
						showLoaderOnConfirm: true,
						text: 'Please enter the Social Club username you want to add. When you click "Add", the username will automatically be added if it exists.',
						title: "Enter username",
						type: "input",
					},
					function(inputValue){
						if (inputValue === false) return false;

						if (inputValue.trim() === "") {
							swal.showInputError("The username field can't be empty.");
							return false
						}

						if (inputValue.trim().match(new RegExp("([^A-Za-z0-9-_\.])"))) {
							swal.showInputError("The username field contains invalid characters.");
							return false
						}

						if (inputValue.trim().length < 6) {
							swal.showInputError("The username field can't be shorter than 6 characters.");
							return false
						}

						if (inputValue.trim().length > 16) {
							swal.showInputError("The username field can't be longer than 16 characters.");
							return false
						}

						$.ajax({
							url: "https://socialclub.rockstargames.com/Friends/GetAccountDetails?nickname="+inputValue.trim()+"&full=false",
							headers: {
								"Accept": "application/json",
								"RequestVerificationToken": requestToken
							},
							error: function(err){
								if (debug) {
									console.groupCollapsed();
									console.debug("GetAccountDetails AJAX incomplete");
									console.debug("\tURL:\t"+this.url);
									console.debug("\tMethod:\t"+this.type);
									console.debug("");
									console.debug("Request:");
									console.debug(this);
									console.debug("");
									console.debug("Response:");
									console.debug(err);
									console.groupEnd();
								};

								swal(err.status+" - "+err.statusText, 'Something went wrong while trying to check whether "'+inputValue.trim()+'" exists or not.', "error");
							},
							success: function(data){
								if (debug) {
									console.groupCollapsed();
									console.debug("GetAccountDetails AJAX complete");
									console.debug("\tURL:\t"+this.url);
									console.debug("\tMethod:\t"+this.type);
									console.debug("");
									console.debug("Request:");
									console.debug(this);
									console.debug("");
									console.debug("Response:");
									console.debug(data);
									console.groupEnd();
								};

								Add(data, inputValue);
							}
						});
					});
				} catch (err) {
					console.error("Error during #btnQuickAddScript.click():\n\n"+err.stack);
					return;
				}
			});

			function RetrieveAll(responseData){
				try {
					var children = [];

					for (var i = 0; i <= Math.ceil(responseData.TotalCount / 12); i++) {
						$.ajax({
							url: "https://socialclub.rockstargames.com/friends/GetFriendsAndInvitesSentJson?pageNumber="+i+"&onlineService=sc&nickname=&pendingInvitesOnly=false",
							headers: {
								"Accept": "application/json",
								"RequestVerificationToken": requestToken
							},
							error: function(err){
								if (debug) {
									console.groupCollapsed();
									console.debug("GetFriendsAndInvitesSentJson AJAX incomplete");
									console.debug("\tURL:\t"+this.url);
									console.debug("\tMethod:\t"+this.type);
									console.debug("");
									console.debug("Request:");
									console.debug(this);
									console.debug("");
									console.debug("Response:");
									console.debug(err);
									console.groupEnd();
								};

								swal(err.status+" - "+err.statusText, "Something went wrong while trying to fetch data from page "+i+".", "error");
							},
							success: function(data){
								if (debug) {
									console.groupCollapsed();
									console.debug("GetFriendsAndInvitesSentJson AJAX complete");
									console.debug("\tURL:\t"+this.url);
									console.debug("\tMethod:\t"+this.type);
									console.debug("");
									console.debug("Request:");
									console.debug(this);
									console.debug("");
									console.debug("Response:");
									console.debug(data);
									console.groupEnd();
								};

								if (data.Status == true) {
									data.RockstarAccounts.forEach(function(e){
										children.push(e);
									});

									if (children.length == responseData.TotalCount){
										Loop(children);
									};
								} else {
									swal("Something went wrong", "Something went wrong while trying to fetch data from page "+i+".", "error");
								}
							}
						});
					};
				} catch (err) {
					console.error("Error during RetrieveAll():\n\n"+err.stack);
					return;
				}
			}

			function Loop(array) {
				try {
					setTimeout(function() {
						if (array.length > 0) {
							Delete(array.pop());
							Loop(array);
						} else {
							swal("Friends removed", "All your friends should have been removed.\n\nYou can see exactly which friends have been removed and which ones haven't by opening the console (F12). To view the changes to your friends list, please refresh the page.", "success");
						}
					}, 1000)
				} catch (err) {
					console.error("Error during Loop():\n\n"+err.stack);
					return;
				}
			}

			function Add(rockstarObj, inputValue){
				try {
					if (dryrun) return;

					if (rockstarObj.Status == true) {
						$.ajax({
							url: "https://socialclub.rockstargames.com/friends/UpdateFriend",
							type: "PUT",
							data: '{"id":'+rockstarObj.RockstarId+',"op":"addfriend","custommessage":""}',
							headers: {
								"Content-Type": "application/json",
								"RequestVerificationToken": requestToken
							},
							error: function(err){
								if (debug) {
									console.groupCollapsed();
									console.debug("UpdateFriend AJAX incomplete");
									console.debug("\tURL:\t"+this.url);
									console.debug("\tMethod:\t"+this.type);
									console.debug("\tData:\t"+this.data);
									console.debug("");
									console.debug("Request:");
									console.debug(this);
									console.debug("");
									console.debug("Response:");
									console.debug(err);
									console.groupEnd();
								};

								swal(err.status+" - "+err.statusText, 'Something went wrong trying to add "' + rockstarObj.Nickname + '".', "error");
							},
							success: function(data){
								if (debug) {
									console.groupCollapsed();
									console.debug("UpdateFriend AJAX complete");
									console.debug("\tURL:\t"+this.url);
									console.debug("\tMethod:\t"+this.type);
									console.debug("\tData:\t"+this.data);
									console.debug("");
									console.debug("Request:");
									console.debug(this);
									console.debug("");
									console.debug("Response:");
									console.debug(data);
									console.groupEnd();
								};

								if (data.Status == true) {
									swal("User added", 'A friend request has been sent to "' + rockstarObj.Nickname + '".\n\nTo view the changes to your friends list, please refresh the page.', "success");
								} else {
									swal("Something went wrong", 'Something went wrong trying to add "' + rockstarObj.Nickname + '".', "error");
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
						swal("User not found", 'The nickname "'+inputValue+'" doesn\'t exist.', "warning");
					}
				} catch (err) {
					console.error("Error during Add():\n\n"+err.stack);
					return;
				}
			}

			function Delete(rockstarObj) {
				try {
					if (dryrun) return;

					if (rockstarObj.Relationship.toLowerCase() === "friend") {
						$.ajax({
							url: "https://socialclub.rockstargames.com/friends/UpdateFriend",
							type: "PUT",
							data: '{"id":'+rockstarObj.RockstarId+',"op":"delete"}',
							headers: {
								"Content-Type": "application/json",
								"RequestVerificationToken": requestToken
							},
							error: function(err){
								if (debug) {
									console.groupCollapsed();
									console.debug("UpdateFriend AJAX incomplete");
									console.debug("\tURL:\t"+this.url);
									console.debug("\tMethod:\t"+this.type);
									console.debug("\tData:\t"+this.data);
									console.debug("");
									console.debug("Request:");
									console.debug(this);
									console.debug("");
									console.debug("Response:");
									console.debug(err);
									console.groupEnd();
								};

								console.error("Your friend " + rockstarObj.Name + " could not be removed. ("+err.status+" - "+err.statusText+")");
							},
							success: function(data){
								if (debug) {
									console.groupCollapsed();
									console.debug("UpdateFriend AJAX complete");
									console.debug("\tURL:\t"+this.url);
									console.debug("\tMethod:\t"+this.type);
									console.debug("\tData:\t"+this.data);
									console.debug("");
									console.debug("Request:");
									console.debug(this);
									console.debug("");
									console.debug("Response:");
									console.debug(data);
									console.groupEnd();
								};

								if (data.Status == true) {
									console.info("Your friend " + rockstarObj.Name + " has been removed.");
								} else {
									console.error("Your friend " + rockstarObj.Name + " could not be removed.");
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
					} else if (rockstarObj.Relationship.toLowerCase() === "invitedbyme") {
						$.ajax({
							url: "https://socialclub.rockstargames.com/friends/UpdateFriend",
							type: "PUT",
							data: '{"id":'+rockstarObj.RockstarId+',"op":"cancel"}',
							headers: {
								"Content-Type": "application/json",
								"RequestVerificationToken": requestToken
							},
							error: function(err){
								if (debug) {
									console.groupCollapsed();
									console.debug("UpdateFriend AJAX incomplete");
									console.debug("\tURL:\t"+this.url);
									console.debug("\tMethod:\t"+this.type);
									console.debug("\tData:\t"+this.data);
									console.debug("");
									console.debug("Request:");
									console.debug(this);
									console.debug("");
									console.debug("Response:");
									console.debug(err);
									console.groupEnd();
								};

								console.error("The friend request you sent to " + rockstarObj.Name + " could not be cancelled. ("+err.status+" - "+err.statusText+")");
							},
							success: function(data){
								if (debug) {
									console.groupCollapsed();
									console.debug("UpdateFriend AJAX complete");
									console.debug("\tURL:\t"+this.url);
									console.debug("\tMethod:\t"+this.type);
									console.debug("\tData:\t"+this.data);
									console.debug("");
									console.debug("Request:");
									console.debug(this);
									console.debug("");
									console.debug("Response:");
									console.debug(data);
									console.groupEnd();
								};

								if (data.Status == true) {
									console.info("The friend request you sent to " + rockstarObj.Name + " has been cancelled.");
								} else {
									console.error("The friend request you sent to " + rockstarObj.Name + " could not be cancelled.");
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
						console.warn("The user " + rockstarObj.Name + " has been skipped (reason: type \""+rockstarObj.Relationship+"\" not supported).");
					}
				} catch (err) {
					console.error("Error during Delete():\n\n"+err.stack);
					return;
				}
			}
		} else {
			try {
				swal({
					allowOutsideClick: true,
					cancelButtonText: "No",
					closeOnConfirm: false,
					confirmButtonText: "Yes",
					showCancelButton: true,
					text: "Whoops, you accidentally activated the script on a wrong web page. To use the script, first browse to the correct page, then click the bookmark again.\n\nDo you want to go to the Social Club friends page now?",
					title: "Wrong site",
					type: "warning"
				},
				function(){
					window.location.href = "https://socialclub.rockstargames.com/friends/index";
				});
			} catch (err) {
				console.error("Error during otherPage swal():\n\n"+err.stack);
				return;
			}
		}
	}, 1000);
}