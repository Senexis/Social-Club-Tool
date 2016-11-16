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

			$('<a class="btn btnGold btnRounded" href="#" id="btnConfirmDeleteAllMessagesScript" style="margin-bottom: 8px;">delete all messages</a>').prependTo('#friendsPage');
			$("#btnConfirmDeleteAllMessagesScript").click(function(e) {
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
						text: "All messages will be deleted from your inbox.",
						title: "Are you sure?",
						type: "warning",
					},
					function(isConfirm){
						if (isConfirm) {
							$.ajax({
								url: "https://socialclub.rockstargames.com/Message/GetMessageCount",
								headers: {
									"Accept": "application/json",
									"RequestVerificationToken": requestToken
								},
								error: function(err){
									if (debug) {
										console.groupCollapsed("GetMessageCount AJAX FAIL");
										console.group("Request");
										console.debug(this);
										console.groupEnd();
										console.group("Response");
										console.debug(err);
										console.groupEnd();
										console.groupEnd();
									};

									swal(err.status+" - "+err.statusText, "Something went wrong while trying to fetch initial data.", "error");
								},
								success: function(data){
									if (debug) {
										console.groupCollapsed("GetMessageCount AJAX OK");
										console.group("Request");
										console.debug(this);
										console.groupEnd();
										console.group("Response");
										console.debug(data);
										console.groupEnd();
										console.groupEnd();
									};

									if (data.Total > 0) {
										RetrieveAllMessageUsers([]);
									} else {
										swal("No messages", "There were no messages to delete.", "success");
									}
								}
							});
						} else {
							return;
						}
					});
				} catch (err) {
					console.error("Error during #btnConfirmDeleteAllMessagesScript.click():\n\n"+err.stack);
					return;
				}
			});

			$('<a class="btn btnGold btnRounded" href="#" id="btnConfirmRejectAllFrsScript" style="margin-bottom: 8px;margin-right: 5px;">reject all friend requests</a>').prependTo('#friendsPage');
			$("#btnConfirmRejectAllFrsScript").click(function(e) {
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
						text: "All friend requests you have received will be rejected.",
						title: "Are you sure?",
						type: "warning",
					},
					function(isConfirm){
						if (isConfirm) {
							var children = [];

							$.ajax({
								url: "https://socialclub.rockstargames.com/friends/GetReceivedInvitesJson",
								headers: {
									"Accept": "application/json",
									"RequestVerificationToken": requestToken
								},
								error: function(err){
									if (debug) {
										console.groupCollapsed("GetReceivedInvitesJson AJAX FAIL");
										console.group("Request");
										console.debug(this);
										console.groupEnd();
										console.group("Response");
										console.debug(err);
										console.groupEnd();
										console.groupEnd();
									};

									swal(err.status+" - "+err.statusText, "Something went wrong while trying to fetch initial data.", "error");
								},
								success: function(data){
									if (debug) {
										console.groupCollapsed("GetReceivedInvitesJson AJAX OK");
										console.group("Request");
										console.debug(this);
										console.groupEnd();
										console.group("Response");
										console.debug(data);
										console.groupEnd();
										console.groupEnd();
									} 

									if (data.Status == true && data.TotalCount > 0) {
										data.RockstarAccounts.forEach(function(e){
											children.push(e);
										});

										if (children.length == data.TotalCount){
											FriendsLoop(children, true);
										};
									} else if (data.Status == true && data.TotalCount == 0) {
										swal("No friend requests", "There were no friend requests to reject.", "success");
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
					console.error("Error during #btnConfirmRejectAllFrsScript.click():\n\n"+err.stack);
					return;
				}
			});

			$('<a class="btn btnGold btnRounded" href="#" id="btnConfirmDeleteAllFriendsScript" style="margin-bottom: 8px;margin-right: 5px;">delete all friends</a>').prependTo('#friendsPage');
			$("#btnConfirmDeleteAllFriendsScript").click(function(e) {
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
								url: "https://socialclub.rockstargames.com/friends/GetFriendsAndInvitesSentJson?pageNumber=0&onlineService=sc&pendingInvitesOnly=false",
								headers: {
									"Accept": "application/json",
									"RequestVerificationToken": requestToken
								},
								error: function(err){
									if (debug) {
										console.groupCollapsed("GetFriendsAndInvitesSentJson AJAX FAIL");
										console.group("Request");
										console.debug(this);
										console.groupEnd();
										console.group("Response");
										console.debug(err);
										console.groupEnd();
										console.groupEnd();
									};

									swal(err.status+" - "+err.statusText, "Something went wrong while trying to fetch initial data.", "error");
								},
								success: function(data){
									if (debug) {
										console.groupCollapsed("GetFriendsAndInvitesSentJson AJAX OK");
										console.group("Request");
										console.debug(this);
										console.groupEnd();
										console.group("Response");
										console.debug(data);
										console.groupEnd();
										console.groupEnd();
									} 

									if (data.Status == true && data.TotalCount > 0) {
										RetrieveAllFriends(data);
									} else if (data.Status == true && data.TotalCount == 0) {
										swal("No friends", "There were no friends to delete.", "success");
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
					console.error("Error during #btnConfirmDeleteAllFriendsScript.click():\n\n"+err.stack);
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

						if (inputValue.trim().toLowerCase() === siteMaster.authUserNickName.toLowerCase()) {
							swal.showInputError("You can't add yourself as a friend.");
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
									console.groupCollapsed("GetAccountDetails AJAX FAIL");
									console.group("Request");
									console.debug(this);
									console.groupEnd();
									console.group("Response");
									console.debug(err);
									console.groupEnd();
									console.groupEnd();
								};

								swal(err.status+" - "+err.statusText, 'Something went wrong while trying to check whether "'+inputValue.trim()+'" exists or not.', "error");
							},
							success: function(data){
								if (debug) {
									console.groupCollapsed("GetAccountDetails AJAX OK");
									console.group("Request");
									console.debug(this);
									console.groupEnd();
									console.group("Response");
									console.debug(data);
									console.groupEnd();
									console.groupEnd();
								};

								AddFriend(data, inputValue);
							}
						});
					});
				} catch (err) {
					console.error("Error during #btnQuickAddScript.click():\n\n"+err.stack);
					return;
				}
			});

			function RetrieveAllMessageUsers(source, pageIndex = 0) {
				try {
					setTimeout(function() {
						$.ajax({
							url: "https://socialclub.rockstargames.com/Message/GetConversationList?pageIndex="+pageIndex,
							headers: {
								"Accept": "application/json",
								"RequestVerificationToken": requestToken
							},
							error: function(err){
								if (debug) {
									console.groupCollapsed("GetConversationList AJAX FAIL");
									console.group("Request");
									console.debug(this);
									console.groupEnd();
									console.group("Response");
									console.debug(err);
									console.groupEnd();
									console.groupEnd();
								};

								swal(err.status+" - "+err.statusText, "Something went wrong while trying to fetch conversation data.", "error");
							},
							success: function(data){
								if (debug) {
									console.groupCollapsed("GetConversationList AJAX OK");
									console.group("Request");
									console.debug(this);
									console.groupEnd();
									console.group("Response");
									console.debug(data);
									console.groupEnd();
									console.groupEnd();
								};

								data.Users.forEach(function(e){
									source.push(e);
								});

								if (data.HasMore === true) {
									RetrieveAllMessageUsers(source, data.NextPageIndex);
								} else {
									if (debug) console.debug("RetrieveAllMessageUsers() complete.");

									RetrieveAllMessages(source);
								}
							}
						});
					}, 1000)
				} catch (err) {
					console.error("Error during RetrieveAllMessageUsers():\n\n"+err.stack);
					return;
				}
			}

			function RetrieveAllMessages(source, target = []) {
				try {
					setTimeout(function() {
						var item = source.pop();
						if (debug) {
							console.groupCollapsed("RetrieveAllMessages() POP");
							console.group("Item");
							console.debug(item);
							console.groupEnd();
							console.groupEnd();
						};

						$.ajax({
							url: "https://socialclub.rockstargames.com/Message/GetMessages?rockstarId="+item.RockstarId,
							headers: {
								"Accept": "application/json",
								"RequestVerificationToken": requestToken
							},
							error: function(err){
								if (debug) {
									console.groupCollapsed("GetMessages AJAX FAIL");
									console.group("Request");
									console.debug(this);
									console.groupEnd();
									console.group("Response");
									console.debug(err);
									console.groupEnd();
									console.groupEnd();
								};

								swal(err.status+" - "+err.statusText, "Something went wrong while trying to fetch messages.", "error");
							},
							success: function(data){
								if (debug) {
									console.groupCollapsed("GetMessages AJAX OK");
									console.group("Request");
									console.debug(this);
									console.groupEnd();
									console.group("Response");
									console.debug(data);
									console.groupEnd();
									console.groupEnd();
								};

								target = target.concat(data.Messages);

								if (source.length > 0) {
									RetrieveAllMessages(source, target);
								} else if (target.length > 0) {
									if (debug) console.debug("RetrieveAllMessages() complete.");

									RemoveAllMessages(target);
								}
							}
						});
					}, 1000)
				} catch (err) {
					console.error("Error during RetrieveAllMessages():\n\n"+err.stack);
					return;
				}
			}

			function RemoveAllMessages(source){
				try {
					if (dryrun) return;

					setTimeout(function() {
						var item = source.pop();
						if (debug) {
							console.groupCollapsed("RemoveAllMessages() POP");
							console.group("Item");
							console.debug(item);
							console.groupEnd();
							console.groupEnd();
						};

						$.ajax({
							url: "https://socialclub.rockstargames.com/Message/DeleteMessage",
							type: "POST",
							data: '{"messageid":'+item.ID+',"isAdmin":'+item.IsAdminMessage+'}',
							headers: {
								"Content-Type": "application/json",
								"RequestVerificationToken": requestToken
							},
							error: function(err){
								if (debug) {
									console.groupCollapsed("DeleteMessage AJAX FAIL");
									console.group("Request");
									console.debug(this);
									console.groupEnd();
									console.group("Response");
									console.debug(err);
									console.groupEnd();
									console.groupEnd();
								};

								console.error("The message sent by " + item.ScNickname + " could not be removed. ("+err.status+" - "+err.statusText+")");
							},
							success: function(data){
								if (debug) {
									console.groupCollapsed("DeleteMessage AJAX OK");
									console.group("Request");
									console.debug(this);
									console.groupEnd();
									console.group("Response");
									console.debug(data);
									console.groupEnd();
									console.groupEnd();
								};

								if (data.Status == true) {
									if (item.ScNickname.toLowerCase() === siteMaster.authUserNickName.toLowerCase()) {
										console.info("A message you sent to someone has been removed.");
									} else {
										console.info("A message " + item.ScNickname + " sent to you has been removed.");
									}
								} else {
									if (item.ScNickname.toLowerCase() === siteMaster.authUserNickName.toLowerCase()) {
										console.info("A message you sent to someone could not be removed.");
									} else {
										console.info("A message " + item.ScNickname + " sent to you could not be removed.");
									}
								}

								if (source.length > 0) {
									RemoveAllMessages(source);
								} else {
									swal("Messages removed", "All of the messages in your inbox should have been removed.\n\nYou can see exactly which friends have been removed and which ones haven't by opening the console (F12). To view the changes to your inbox, please browse to your inbox.", "success");
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
					}, 1000)
				} catch (err) {
					console.error("Error during RemoveAllMessages():\n\n"+err.stack);
					return;
				}
			}

			function RetrieveAllFriends(responseData){
				try {
					var children = [];

					for (var i = 0; i <= Math.ceil(responseData.TotalCount / 12); i++) {
						$.ajax({
							url: "https://socialclub.rockstargames.com/friends/GetFriendsAndInvitesSentJson?pageNumber="+i+"&onlineService=sc&pendingInvitesOnly=false",
							headers: {
								"Accept": "application/json",
								"RequestVerificationToken": requestToken
							},
							error: function(err){
								if (debug) {
									console.groupCollapsed("GetFriendsAndInvitesSentJson AJAX FAIL");
									console.group("Request");
									console.debug(this);
									console.groupEnd();
									console.group("Response");
									console.debug(err);
									console.groupEnd();
									console.groupEnd();
								};

								swal(err.status+" - "+err.statusText, "Something went wrong while trying to fetch data from page "+i+".", "error");
							},
							success: function(data){
								if (debug) {
									console.groupCollapsed("GetFriendsAndInvitesSentJson AJAX OK");
									console.group("Request");
									console.debug(this);
									console.groupEnd();
									console.group("Response");
									console.debug(data);
									console.groupEnd();
									console.groupEnd();
								};

								if (data.Status == true) {
									data.RockstarAccounts.forEach(function(e){
										children.push(e);
									});

									if (children.length == responseData.TotalCount){
										FriendsLoop(children, false);
									};
								} else {
									swal("Something went wrong", "Something went wrong while trying to fetch data from page "+i+".", "error");
								}
							}
						});
					};
				} catch (err) {
					console.error("Error during RetrieveAllFriends():\n\n"+err.stack);
					return;
				}
			}

			function FriendsLoop(array, isFriendRequestLoop) {
				try {
					setTimeout(function() {
						if (array.length > 0) {
							var item = array.pop();
							if (debug) {
								console.groupCollapsed("FriendsLoop() POP");
								console.group("Item");
								console.debug(item);
								console.groupEnd();
								console.groupEnd();
							};

							RemoveFriend(item);
							FriendsLoop(array, isFriendRequestLoop);
						} else {
							if (isFriendRequestLoop) {
								swal("Friend requests rejected", "All friend requests you received should have been rejected.\n\nYou can see exactly which friends have been removed and which ones haven't by opening the console (F12). To view the changes to your friends list, please refresh the page.", "success");
							} else {
								swal("Friends removed", "All your friends should have been removed.\n\nYou can see exactly which friends have been removed and which ones haven't by opening the console (F12). To view the changes to your friends list, please refresh the page.", "success");
							}
						}
					}, 1000)
				} catch (err) {
					console.error("Error during FriendsLoop():\n\n"+err.stack);
					return;
				}
			}

			function AddFriend(rockstarObj, inputValue){
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
									console.groupCollapsed("UpdateFriend AJAX FAIL");
									console.group("Request");
									console.debug(this);
									console.groupEnd();
									console.group("Response");
									console.debug(err);
									console.groupEnd();
									console.groupEnd();
								};

								swal(err.status+" - "+err.statusText, 'Something went wrong trying to add "' + rockstarObj.Nickname + '".', "error");
							},
							success: function(data){
								if (debug) {
									console.groupCollapsed("UpdateFriend AJAX OK");
									console.group("Request");
									console.debug(this);
									console.groupEnd();
									console.group("Response");
									console.debug(data);
									console.groupEnd();
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
					console.error("Error during AddFriend():\n\n"+err.stack);
					return;
				}
			}

			function RemoveFriend(rockstarObj) {
				try {
					if (dryrun) return;

					if (rockstarObj.AllowDelete === true) {
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
									console.groupCollapsed("UpdateFriend AJAX FAIL");
									console.group("Request");
									console.debug(this);
									console.groupEnd();
									console.group("Response");
									console.debug(err);
									console.groupEnd();
									console.groupEnd();
								};

								console.error("Your friend " + rockstarObj.Name + " could not be removed. ("+err.status+" - "+err.statusText+")");
							},
							success: function(data){
								if (debug) {
									console.groupCollapsed("UpdateFriend AJAX OK");
									console.group("Request");
									console.debug(this);
									console.groupEnd();
									console.group("Response");
									console.debug(data);
									console.groupEnd();
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
					} else if (rockstarObj.AllowCancel === true) {
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
									console.groupCollapsed("UpdateFriend AJAX FAIL");
									console.group("Request");
									console.debug(this);
									console.groupEnd();
									console.group("Response");
									console.debug(err);
									console.groupEnd();
									console.groupEnd();
								};

								console.error("The friend request you sent to " + rockstarObj.Name + " could not be cancelled. ("+err.status+" - "+err.statusText+")");
							},
							success: function(data){
								if (debug) {
									console.groupCollapsed("UpdateFriend AJAX OK");
									console.group("Request");
									console.debug(this);
									console.groupEnd();
									console.group("Response");
									console.debug(data);
									console.groupEnd();
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
					} else if (rockstarObj.AllowAdd === true) {
						$.ajax({
							url: "https://socialclub.rockstargames.com/friends/UpdateFriend",
							type: "PUT",
							data: '{"id":'+rockstarObj.RockstarId+',"op":"ignore"}',
							headers: {
								"Content-Type": "application/json",
								"RequestVerificationToken": requestToken
							},
							error: function(err){
								if (debug) {
									console.groupCollapsed("UpdateFriend AJAX FAIL");
									console.group("Request");
									console.debug(this);
									console.groupEnd();
									console.group("Response");
									console.debug(err);
									console.groupEnd();
									console.groupEnd();
								};

								console.error("The friend request you received from " + rockstarObj.Name + " could not be rejected. ("+err.status+" - "+err.statusText+")");
							},
							success: function(data){
								if (debug) {
									console.groupCollapsed("UpdateFriend AJAX OK");
									console.group("Request");
									console.debug(this);
									console.groupEnd();
									console.group("Response");
									console.debug(data);
									console.groupEnd();
									console.groupEnd();
								};

								if (data.Status == true) {
									console.info("The friend request you received from " + rockstarObj.Name + " has been rejected.");
								} else {
									console.error("The friend request you received from " + rockstarObj.Name + " could not be rejected.");
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
					console.error("Error during RemoveFriend():\n\n"+err.stack);
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