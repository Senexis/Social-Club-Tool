function Init(debug, dryRun) {
	if (debug === undefined) debug = false;
	if (dryRun === undefined) dryRun = false;

	try {
		if (!document.getElementById("nt-jqjs")) {
			var jqjs = document.createElement('script');
			jqjs.id = "nt-jqjs";
			jqjs.src = "https://ajax.googleapis.com/ajax/libs/jquery/1.6.3/jquery.min.js";
			document.getElementsByTagName('head')[0].appendChild(jqjs);
		} else {
			if (debug) console.log("jQuery JS was already present.");
		}

		if (!document.getElementById("nt-sacss")) {
			var sacss = document.createElement('link');
			sacss.id = "nt-sacss";
			sacss.rel = "stylesheet";
			sacss.href = "https://cdnjs.cloudflare.com/ajax/libs/sweetalert/1.1.3/sweetalert.min.css";
			document.getElementsByTagName('head')[0].appendChild(sacss);
		} else {
			if (debug) console.log("SweetAlert CSS was already present.");
		}

		if (!document.getElementById("nt-sajs")) {
			var sajs = document.createElement('script');
			sajs.id = "nt-sajs";
			sajs.src = "https://cdnjs.cloudflare.com/ajax/libs/sweetalert/1.1.3/sweetalert.min.js";
			document.getElementsByTagName('head')[0].appendChild(sajs);
		} else {
			if (debug) console.log("SweetAlert JS was already present.");
		}
	} catch (err) {
		console.error("Error during script loader:\n\n"+err.stack);
		return;
	}

	setTimeout(function () {
		if (window.location.href.startsWith("https://socialclub.rockstargames.com/")) {
			try {
				try {
					var verificationToken = siteMaster.aft.replace('<input name="__RequestVerificationToken" type="hidden" value="', '').replace('" />', '').trim();
					var userNickname = siteMaster.authUserNickName;
					var userId = siteMaster.authUserId;
				} catch (err) {
					console.error("Error retrieving account data:\n\n"+err.stack);
					return;
				}

				if (userNickname != "" && userId != 0) {
					if (!document.getElementById("nt-cred")) {
						$('<li id="nt-cred">Social Club tool by <a href="https://github.com/Nadermane">Nadermane</a></li>').appendTo('#footerNav');
					} else {
						$("#nt-cred").remove();
						$('<li id="nt-cred">Social Club tool by <a href="https://github.com/Nadermane">Nadermane</a></li>').appendTo('#footerNav');
						if (debug) console.log("#nt-cred was already present.");
					}

					if (!document.getElementById("nt-dam")) {
						$('<a class="btn btnGold btnRounded" href="#" id="nt-dam" style="margin-bottom: 8px;margin-right: 5px;">delete all messages</a>').prependTo('#page');
					} else {
						$("#nt-dam").remove();
						$('<a class="btn btnGold btnRounded" href="#" id="nt-dam" style="margin-bottom: 8px;margin-right: 5px;">delete all messages</a>').prependTo('#page');
						if (debug) console.log("#nt-dam was already present.");
					}

					$("#nt-dam").click(function(e) {
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
											"RequestVerificationToken": verificationToken
										},
										error: function(err){
											if (debug) {
												console.groupCollapsed("GetMessageCount AJAX FAIL");
												console.group("Request");
												console.log(this);
												console.groupEnd();
												console.group("Response");
												console.log(err);
												console.groupEnd();
												console.groupEnd();
											};

											swal({
												allowOutsideClick: true,
												text: "Something went wrong while trying to fetch initial data.",
												title: err.status+" - "+err.statusText,
												timer: 5000,
												type: "error",
											});	
										},
										success: function(data){
											if (debug) {
												console.groupCollapsed("GetMessageCount AJAX OK");
												console.group("Request");
												console.log(this);
												console.groupEnd();
												console.group("Response");
												console.log(data);
												console.groupEnd();
												console.groupEnd();
											};

											if (data.Total > 0) {
												RetrieveAllMessageUsers([]);
											} else {
												swal({
													allowOutsideClick: true,
													text: "There were no messages to delete.",
													title: "No messages",
													timer: 5000,
													type: "success",
												});	
											}
										}
									});
								} else {
									return;
								}
							});
						} catch (err) {
							console.error("Error during #nt-dam.click():\n\n"+err.stack);
							return;
						}
					});

					if (!document.getElementById("nt-raf")) {
						$('<a class="btn btnGold btnRounded" href="#" id="nt-raf" style="margin-bottom: 8px;margin-right: 5px;">reject all friend requests</a>').prependTo('#page');
					} else {
						$("#nt-raf").remove();
						$('<a class="btn btnGold btnRounded" href="#" id="nt-raf" style="margin-bottom: 8px;margin-right: 5px;">reject all friend requests</a>').prependTo('#page');
						if (debug) console.log("#nt-raf was already present.");
					}

					$("#nt-raf").click(function(e) {
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
											"RequestVerificationToken": verificationToken
										},
										error: function(err){
											if (debug) {
												console.groupCollapsed("GetReceivedInvitesJson AJAX FAIL");
												console.group("Request");
												console.log(this);
												console.groupEnd();
												console.group("Response");
												console.log(err);
												console.groupEnd();
												console.groupEnd();
											};

											swal({
												allowOutsideClick: true,
												text: "Something went wrong while trying to fetch initial data.",
												title: err.status+" - "+err.statusText,
												timer: 5000,
												type: "error",
											});
										},
										success: function(data){
											if (debug) {
												console.groupCollapsed("GetReceivedInvitesJson AJAX OK");
												console.group("Request");
												console.log(this);
												console.groupEnd();
												console.group("Response");
												console.log(data);
												console.groupEnd();
												console.groupEnd();
											} 

											if (data.Status == true && data.TotalCount > 0) {
												data.RockstarAccounts.forEach(function(e) {
													children.push(e);
												});

												if (children.length == data.TotalCount) {
													RetrieveAllFriends(children, true);
												};
											} else if (data.Status == true && data.TotalCount == 0) {
												swal({
													allowOutsideClick: true,
													text: "There were no friend requests to reject.",
													title: "No friend requests",
													timer: 5000,
													type: "success",
												});
											} else {
												swal({
													allowOutsideClick: true,
													text: "Something went wrong while trying to fetch initial data.",
													title: "Something went wrong",
													timer: 5000,
													type: "error",
												});
											}
										}
									});
								} else {
									return;
								}
							});
						} catch (err) {
							console.error("Error during #nt-raf.click():\n\n"+err.stack);
							return;
						}
					});

					if (!document.getElementById("nt-daf")) {
						$('<a class="btn btnGold btnRounded" href="#" id="nt-daf" style="margin-bottom: 8px;margin-right: 5px;">delete all friends</a>').prependTo('#page');
					} else {
						$("#nt-daf").remove();
						$('<a class="btn btnGold btnRounded" href="#" id="nt-daf" style="margin-bottom: 8px;margin-right: 5px;">delete all friends</a>').prependTo('#page');
						if (debug) console.log("#nt-daf was already present.");
					}

					$("#nt-daf").click(function(e) {
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
											"RequestVerificationToken": verificationToken
										},
										error: function(err){
											if (debug) {
												console.groupCollapsed("GetFriendsAndInvitesSentJson AJAX FAIL");
												console.group("Request");
												console.log(this);
												console.groupEnd();
												console.group("Response");
												console.log(err);
												console.groupEnd();
												console.groupEnd();
											};

											swal({
												allowOutsideClick: true,
												text: "Something went wrong while trying to fetch initial data.",
												title: err.status+" - "+err.statusText,
												timer: 5000,
												type: "error",
											});
										},
										success: function(data){
											if (debug) {
												console.groupCollapsed("GetFriendsAndInvitesSentJson AJAX OK");
												console.group("Request");
												console.log(this);
												console.groupEnd();
												console.group("Response");
												console.log(data);
												console.groupEnd();
												console.groupEnd();
											} 

											if (data.Status == true && data.TotalCount > 0) {
												RetrieveAllFriends([]);
											} else if (data.Status == true && data.TotalCount == 0) {
												swal({
													allowOutsideClick: true,
													text: "There were no friends to delete.",
													title: "No friends",
													timer: 5000,
													type: "success",
												});
											} else {
												swal({
													allowOutsideClick: true,
													text: "Something went wrong while trying to fetch initial data.",
													title: "Something went wrong",
													timer: 5000,
													type: "error",
												});
											}
										}
									});
								} else {
									return;
								}
							});
						} catch (err) {
							console.error("Error during #nt-daf.click():\n\n"+err.stack);
							return;
						}
					});

					if (!document.getElementById("nt-qa")) {
						$('<a class="btn btnGold btnRounded" href="#" id="nt-qa" style="margin-bottom: 8px;margin-right: 5px;">quick-add user</a>').prependTo('#page');
					} else {
						$("#nt-qa").remove();
						$('<a class="btn btnGold btnRounded" href="#" id="nt-qa" style="margin-bottom: 8px;margin-right: 5px;">quick-add user</a>').prependTo('#page');
						if (debug) console.log("#nt-qa was already present.");
					}

					$("#nt-qa").click(function(e) {
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

								if (inputValue.trim().toLowerCase() === userNickname.toLowerCase()) {
									swal.showInputError("You can't add yourself as a friend.");
									return false
								}

								$.ajax({
									url: "https://socialclub.rockstargames.com/Friends/GetAccountDetails?nickname="+inputValue.trim()+"&full=false",
									headers: {
										"Accept": "application/json",
										"RequestVerificationToken": verificationToken
									},
									error: function(err){
										if (debug) {
											console.groupCollapsed("GetAccountDetails AJAX FAIL");
											console.group("Request");
											console.log(this);
											console.groupEnd();
											console.group("Response");
											console.log(err);
											console.groupEnd();
											console.groupEnd();
										};

										swal({
											allowOutsideClick: true,
											text: 'Something went wrong while trying to check whether "'+inputValue.trim()+'" exists or not.',
											title: err.status+" - "+err.statusText,
											timer: 5000,
											type: "error",
										});
									},
									success: function(data){
										if (debug) {
											console.groupCollapsed("GetAccountDetails AJAX OK");
											console.group("Request");
											console.log(this);
											console.groupEnd();
											console.group("Response");
											console.log(data);
											console.groupEnd();
											console.groupEnd();
										};

										if (data.Status == true) {
											AddFriend(data);
										} else {
											swal({
												allowOutsideClick: true,
												text: 'The nickname "'+inputValue+'" doesn\'t exist.',
												title: "User not found",
												timer: 5000,
												type: "warning",
											});
										}
									}
								});
							});
						} catch (err) {
							console.error("Error during #nt-qa.click():\n\n"+err.stack);
							return;
						}
					});

					function RetrieveAllMessageUsers(source, pageIndex) {
						try {
							if (pageIndex === undefined) pageIndex = 0;

							setTimeout(function() {
								$.ajax({
									url: "https://socialclub.rockstargames.com/Message/GetConversationList?pageIndex="+pageIndex,
									headers: {
										"Accept": "application/json",
										"RequestVerificationToken": verificationToken
									},
									error: function(err){
										if (debug) {
											console.groupCollapsed("GetConversationList AJAX FAIL");
											console.group("Request");
											console.log(this);
											console.groupEnd();
											console.group("Response");
											console.log(err);
											console.groupEnd();
											console.groupEnd();
										};

										swal({
											allowOutsideClick: true,
											text: "Something went wrong while trying to fetch conversation data.",
											title: err.status+" - "+err.statusText,
											timer: 5000,
											type: "error",
										});
									},
									success: function(data){
										if (debug) {
											console.groupCollapsed("GetConversationList AJAX OK");
											console.group("Request");
											console.log(this);
											console.groupEnd();
											console.group("Response");
											console.log(data);
											console.groupEnd();
											console.groupEnd();
										};

										data.Users.forEach(function(e){
											source.push(e);
										});

										if (data.HasMore === true) {
											RetrieveAllMessageUsers(source, data.NextPageIndex);
										} else {
											if (debug) console.log("RetrieveAllMessageUsers() complete.");

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

					function RetrieveAllMessages(source, target) {
						try {
							if (target === undefined) target = [];

							setTimeout(function() {
								var item = source.pop();
								if (debug) {
									console.groupCollapsed("RetrieveAllMessages() POP");
									console.group("Item");
									console.log(item);
									console.groupEnd();
									console.groupEnd();
								};

								$.ajax({
									url: "https://socialclub.rockstargames.com/Message/GetMessages?rockstarId="+item.RockstarId,
									headers: {
										"Accept": "application/json",
										"RequestVerificationToken": verificationToken
									},
									error: function(err){
										if (debug) {
											console.groupCollapsed("GetMessages AJAX FAIL");
											console.group("Request");
											console.log(this);
											console.groupEnd();
											console.group("Response");
											console.log(err);
											console.groupEnd();
											console.groupEnd();
										};

										if (source.length > 0) {
											RetrieveAllMessages(source, target);
										} else if (target.length > 0) {
											if (debug) console.log("RetrieveAllMessages() complete.");

											RemoveMessage(target);
										}
									},
									success: function(data){
										if (debug) {
											console.groupCollapsed("GetMessages AJAX OK");
											console.group("Request");
											console.log(this);
											console.groupEnd();
											console.group("Response");
											console.log(data);
											console.groupEnd();
											console.groupEnd();
										};

										target = target.concat(data.Messages);

										if (source.length > 0) {
											RetrieveAllMessages(source, target);
										} else if (target.length > 0) {
											if (debug) console.log("RetrieveAllMessages() complete.");

											RemoveMessage(target);
										}
									}
								});
							}, 1000)
						} catch (err) {
							console.error("Error during RetrieveAllMessages():\n\n"+err.stack);
							return;
						}
					}

					function RemoveMessage(source){
						try {
							if (dryRun) return;

							setTimeout(function() {
								var item = source.pop();
								if (item === undefined) {
									if (debug) console.log("RemoveMessage() SKIP undefined")
									RemoveMessage(source);
									return;
								}

								if (debug) {
									console.groupCollapsed("RemoveMessage() POP");
									console.group("Item");
									console.log(item);
									console.groupEnd();
									console.groupEnd();
								};

								$.ajax({
									url: "https://socialclub.rockstargames.com/Message/DeleteMessage",
									type: "POST",
									data: '{"messageid":'+item.ID+',"isAdmin":'+item.IsAdminMessage+'}',
									headers: {
										"Content-Type": "application/json",
										"RequestVerificationToken": verificationToken
									},
									error: function(err){
										if (debug) {
											console.groupCollapsed("DeleteMessage AJAX FAIL");
											console.group("Request");
											console.log(this);
											console.groupEnd();
											console.group("Response");
											console.log(err);
											console.groupEnd();
											console.groupEnd();
										};

										if (item.ScNickname.toLowerCase() === userNickname.toLowerCase()) {
											console.error("A message you sent to someone could not be removed. ("+err.status+" - "+err.statusText+")");
										} else {
											console.error("A message " + item.ScNickname + " sent to you could not be removed. ("+err.status+" - "+err.statusText+")");
										}

										if (source.length > 0) {
											RemoveMessage(source);
										} else {
											swal({
												allowOutsideClick: true,
												text: "All of the messages in your inbox should have been removed.\n\nYou can see exactly which friends have been removed and which ones haven't by opening the console (F12). To view the changes to your inbox, please browse to your inbox.",
												title: "Messages removed",
												timer: 5000,
												type: "success",
											});
										}
									},
									success: function(data){
										if (debug) {
											console.groupCollapsed("DeleteMessage AJAX OK");
											console.group("Request");
											console.log(this);
											console.groupEnd();
											console.group("Response");
											console.log(data);
											console.groupEnd();
											console.groupEnd();
										};

										if (data.Status == true) {
											if (item.ScNickname.toLowerCase() === userNickname.toLowerCase()) {
												console.info("A message you sent to someone has been removed.");
											} else {
												console.info("A message " + item.ScNickname + " sent to you has been removed.");
											}
										} else {
											if (item.ScNickname.toLowerCase() === userNickname.toLowerCase()) {
												console.info("A message you sent to someone could not be removed.");
											} else {
												console.info("A message " + item.ScNickname + " sent to you could not be removed.");
											}
										}

										if (source.length > 0) {
											RemoveMessage(source);
										} else {
											swal({
												allowOutsideClick: true,
												text: "All of the messages in your inbox should have been removed.\n\nYou can see exactly which friends have been removed and which ones haven't by opening the console (F12). To view the changes to your inbox, please browse to your inbox.",
												title: "Messages removed",
												timer: 5000,
												type: "success",
											});
										}
									},
									xhr: function() {
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
							console.error("Error during RemoveMessage():\n\n"+err.stack);
							return;
						}
					}

					function RetrieveAllFriends(source, pageIndex){
						try {
							if (pageIndex === undefined) pageIndex = 0;

							setTimeout(function() {
								$.ajax({
									url: "https://socialclub.rockstargames.com/friends/GetFriendsAndInvitesSentJson?pageNumber="+pageIndex+"&onlineService=sc&pendingInvitesOnly=false",
									headers: {
										"Accept": "application/json",
										"RequestVerificationToken": verificationToken
									},
									error: function(err){
										if (debug) {
											console.groupCollapsed("GetFriendsAndInvitesSentJson AJAX FAIL");
											console.group("Request");
											console.log(this);
											console.groupEnd();
											console.group("Response");
											console.log(err);
											console.groupEnd();
											console.groupEnd();
										};

										swal({
											allowOutsideClick: true,
											text: "Something went wrong while trying to fetch data from page "+pageIndex+".",
											title: err.status+" - "+err.statusText,
											timer: 5000,
											type: "error",
										});
									},
									success: function(data){
										if (debug) {
											console.groupCollapsed("GetFriendsAndInvitesSentJson AJAX OK");
											console.group("Request");
											console.log(this);
											console.groupEnd();
											console.group("Response");
											console.log(data);
											console.groupEnd();
											console.groupEnd();
										};

										if (data.Status == true) {
											data.RockstarAccounts.forEach(function(e){
												if (e !== undefined) source.push(e);
											});
										} else {
											swal({
												allowOutsideClick: true,
												text: "Something went wrong while trying to fetch data from page "+pageIndex+".",
												title: "Something went wrong",
												timer: 5000,
												type: "error",
											});
										}

										if (source.length < data.TotalCount) {
											RetrieveAllFriends(source, (pageIndex + 1));
										} else {
											if (debug) console.log("RetrieveAllFriends() complete.");

											RemoveFriend(source);
										}
									}
								});
							}, 1000)
						} catch (err) {
							console.error("Error during RetrieveAllFriends():\n\n"+err.stack);
							return;
						}
					}

					function RemoveFriend(source, isFriendRequestLoop) {
						try {
							if (dryRun) return;
							if (isFriendRequestLoop === undefined) isFriendRequestLoop = false;

							setTimeout(function() {
								var item = source.pop();
								if (item === undefined) {
									if (debug) console.log("RemoveFriend() SKIP undefined")
									RemoveFriend(source);
									return;
								}

								if (item.AllowDelete === true) {
									$.ajax({
										url: "https://socialclub.rockstargames.com/friends/UpdateFriend",
										type: "PUT",
										data: '{"id":'+item.RockstarId+',"op":"delete"}',
										headers: {
											"Content-Type": "application/json",
											"RequestVerificationToken": verificationToken
										},
										error: function(err){
											if (debug) {
												console.groupCollapsed("UpdateFriend AJAX FAIL");
												console.group("Request");
												console.log(this);
												console.groupEnd();
												console.group("Response");
												console.log(err);
												console.groupEnd();
												console.groupEnd();
											};

											console.error("Your friend " + item.Name + " could not be removed. ("+err.status+" - "+err.statusText+")");
										},
										success: function(data){
											if (debug) {
												console.groupCollapsed("UpdateFriend AJAX OK");
												console.group("Request");
												console.log(this);
												console.groupEnd();
												console.group("Response");
												console.log(data);
												console.groupEnd();
												console.groupEnd();
											};

											if (data.Status == true) {
												console.info("Your friend " + item.Name + " has been removed.");
											} else {
												console.error("Your friend " + item.Name + " could not be removed.");
											}

											if (source.length > 0) {
												RemoveFriend(source);
											} else {
												if (isFriendRequestLoop) {
													swal({
														allowOutsideClick: true,
														text: "All friend requests you received should have been rejected.\n\nYou can see exactly which friends have been removed and which ones haven't by opening the console (F12). To view the changes to your friends list, please refresh the page.",
														title: "Friend requests rejected",
														timer: 5000,
														type: "success",
													});
												} else {
													swal({
														allowOutsideClick: true,
														text: "All your friends should have been removed.\n\nYou can see exactly which friends have been removed and which ones haven't by opening the console (F12). To view the changes to your friends list, please refresh the page.",
														title: "Friends removed",
														timer: 5000,
														type: "success",
													});
												}
											}
										},
										xhr: function() {
											var xhr = jQuery.ajaxSettings.xhr();
											var setRequestHeader = xhr.setRequestHeader;
											
											xhr.setRequestHeader = function(name, value) {
												if (name == 'X-Requested-With') return;
												setRequestHeader.call(this, name, value);
											}

											return xhr;
										}
									});
								} else if (item.AllowCancel === true) {
									$.ajax({
										url: "https://socialclub.rockstargames.com/friends/UpdateFriend",
										type: "PUT",
										data: '{"id":'+item.RockstarId+',"op":"cancel"}',
										headers: {
											"Content-Type": "application/json",
											"RequestVerificationToken": verificationToken
										},
										error: function(err){
											if (debug) {
												console.groupCollapsed("UpdateFriend AJAX FAIL");
												console.group("Request");
												console.log(this);
												console.groupEnd();
												console.group("Response");
												console.log(err);
												console.groupEnd();
												console.groupEnd();
											};

											console.error("The friend request you sent to " + item.Name + " could not be cancelled. ("+err.status+" - "+err.statusText+")");
										},
										success: function(data){
											if (debug) {
												console.groupCollapsed("UpdateFriend AJAX OK");
												console.group("Request");
												console.log(this);
												console.groupEnd();
												console.group("Response");
												console.log(data);
												console.groupEnd();
												console.groupEnd();
											};

											if (data.Status == true) {
												console.info("The friend request you sent to " + item.Name + " has been cancelled.");
											} else {
												console.error("The friend request you sent to " + item.Name + " could not be cancelled.");
											}

											if (source.length > 0) {
												RemoveFriend(source);
											} else {
												if (isFriendRequestLoop) {
													swal({
														allowOutsideClick: true,
														text: "All friend requests you received should have been rejected.\n\nYou can see exactly which friends have been removed and which ones haven't by opening the console (F12). To view the changes to your friends list, please refresh the page.",
														title: "Friend requests rejected",
														timer: 5000,
														type: "success",
													});
												} else {
													swal({
														allowOutsideClick: true,
														text: "All your friends should have been removed.\n\nYou can see exactly which friends have been removed and which ones haven't by opening the console (F12). To view the changes to your friends list, please refresh the page.",
														title: "Friends removed",
														timer: 5000,
														type: "success",
													});
												}
											}
										},
										xhr: function() {
											var xhr = jQuery.ajaxSettings.xhr();
											var setRequestHeader = xhr.setRequestHeader;
											
											xhr.setRequestHeader = function(name, value) {
												if (name == 'X-Requested-With') return;
												setRequestHeader.call(this, name, value);
											}

											return xhr;
										}
									});
								} else if (item.AllowAdd === true) {
									$.ajax({
										url: "https://socialclub.rockstargames.com/friends/UpdateFriend",
										type: "PUT",
										data: '{"id":'+item.RockstarId+',"op":"ignore"}',
										headers: {
											"Content-Type": "application/json",
											"RequestVerificationToken": verificationToken
										},
										error: function(err){
											if (debug) {
												console.groupCollapsed("UpdateFriend AJAX FAIL");
												console.group("Request");
												console.log(this);
												console.groupEnd();
												console.group("Response");
												console.log(err);
												console.groupEnd();
												console.groupEnd();
											};

											console.error("The friend request you received from " + item.Name + " could not be rejected. ("+err.status+" - "+err.statusText+")");
										},
										success: function(data){
											if (debug) {
												console.groupCollapsed("UpdateFriend AJAX OK");
												console.group("Request");
												console.log(this);
												console.groupEnd();
												console.group("Response");
												console.log(data);
												console.groupEnd();
												console.groupEnd();
											};

											if (data.Status == true) {
												console.info("The friend request you received from " + item.Name + " has been rejected.");
											} else {
												console.error("The friend request you received from " + item.Name + " could not be rejected.");
											}

											if (source.length > 0) {
												RemoveFriend(source);
											} else {
												if (isFriendRequestLoop) {
													swal({
														allowOutsideClick: true,
														text: "All friend requests you received should have been rejected.\n\nYou can see exactly which friends have been removed and which ones haven't by opening the console (F12). To view the changes to your friends list, please refresh the page.",
														title: "Friend requests rejected",
														timer: 5000,
														type: "success",
													});
												} else {
													swal({
														allowOutsideClick: true,
														text: "All your friends should have been removed.\n\nYou can see exactly which friends have been removed and which ones haven't by opening the console (F12). To view the changes to your friends list, please refresh the page.",
														title: "Friends removed",
														timer: 5000,
														type: "success",
													});
												}
											}
										},
										xhr: function() {
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
									console.warn("The user " + item.Name + " has been skipped (reason: type \""+item.Relationship+"\" not supported).");

									if (source.length > 0) {
										RemoveFriend(source);
									} else {
										if (isFriendRequestLoop) {
											swal({
												allowOutsideClick: true,
												text: "All friend requests you received should have been rejected.\n\nYou can see exactly which friends have been removed and which ones haven't by opening the console (F12). To view the changes to your friends list, please refresh the page.",
												title: "Friend requests rejected",
												timer: 5000,
												type: "success",
											});
										} else {
											swal({
												allowOutsideClick: true,
												text: "All your friends should have been removed.\n\nYou can see exactly which friends have been removed and which ones haven't by opening the console (F12). To view the changes to your friends list, please refresh the page.",
												title: "Friends removed",
												timer: 5000,
												type: "success",
											});
										}
									}
								}
							}, 1000)
						} catch (err) {
							console.error("Error during RemoveFriend():\n\n"+err.stack);
							return;
						}
					}

					function AddFriend(source){
						try {
							if (dryRun) return;

							$.ajax({
								url: "https://socialclub.rockstargames.com/friends/UpdateFriend",
								type: "PUT",
								data: '{"id":'+source.RockstarId+',"op":"addfriend","custommessage":""}',
								headers: {
									"Content-Type": "application/json",
									"RequestVerificationToken": verificationToken
								},
								error: function(err){
									if (debug) {
										console.groupCollapsed("UpdateFriend AJAX FAIL");
										console.group("Request");
										console.log(this);
										console.groupEnd();
										console.group("Response");
										console.log(err);
										console.groupEnd();
										console.groupEnd();
									};

									swal({
										allowOutsideClick: true,
										text: 'Something went wrong trying to add "' + source.Nickname + '".',
										title: err.status+" - "+err.statusText,
										timer: 5000,
										type: "error",
									});
								},
								success: function(data){
									if (debug) {
										console.groupCollapsed("UpdateFriend AJAX OK");
										console.group("Request");
										console.log(this);
										console.groupEnd();
										console.group("Response");
										console.log(data);
										console.groupEnd();
										console.groupEnd();
									};

									if (data.Status == true) {
										swal({
											allowOutsideClick: true,
											text: 'A friend request has been sent to "' + source.Nickname + '".\n\nTo view the changes to your friends list, please refresh the page.',
											title: "User added",
											timer: 5000,
											type: "success",
										});
									} else {
										swal({
											allowOutsideClick: true,
											text: 'Something went wrong trying to add "' + source.Nickname + '".',
											title: "Something went wrong",
											timer: 5000,
											type: "error",
										});
									}
								},
								xhr: function() {
									var xhr = jQuery.ajaxSettings.xhr();
									var setRequestHeader = xhr.setRequestHeader;
									
									xhr.setRequestHeader = function(name, value) {
										if (name == 'X-Requested-With') return;
										setRequestHeader.call(this, name, value);
									}

									return xhr;
								}
							});
						} catch (err) {
							console.error("Error during AddFriend():\n\n"+err.stack);
							return;
						}
					}
				} else {
					swal({
						allowOutsideClick: true,
						text: "The Social Club tool requires you to log in to be able to apply changes to your account. Please log into the account you want to use with the Social Club tool, then click the bookmark again.",
						title: "Log in required",
						type: "warning"
					});
				}
			} catch (err) {
				console.error("Uncaught exception:\n\n"+err.stack);
				return;
			}
		} else {
			try {
				swal({
					allowOutsideClick: true,
					cancelButtonText: "No",
					closeOnConfirm: false,
					confirmButtonText: "Yes",
					showCancelButton: true,
					text: "Whoops, you accidentally activated the Social Club tool on a wrong web page. To use the script, first browse to the correct page, then click the bookmark again.\n\nDo you want to go to the Social Club main page now?",
					title: "Wrong site",
					type: "warning"
				},
				function(){
					window.location.href = "https://socialclub.rockstargames.com/";
				});
			} catch (err) {
				console.error("Error during otherPage swal():\n\n"+err.stack);
				return;
			}
		}
	}, 1000);
}