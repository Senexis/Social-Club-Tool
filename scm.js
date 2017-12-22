function Init(friendMessage, checkBlocked, debug) {
	const APP_VERSION = "1.1.1";
	const APP_NAME = "Social Club Utility Tool";
	const APP_AUTHOR = "Senexys";
	const APP_LINK = "https://github.com/Senexis/Social-Club-Tool";
	const APP_LINK_ISSUES = "https://github.com/Senexis/Social-Club-Tool/issues/new";
	const APP_LINK_UPDATE = "https://github.com/Senexis/Social-Club-Tool/#usage";
	const APP_LINK_VERSIONS = "https://raw.githubusercontent.com/Senexis/Social-Club-Tool/master/v.json?callback";
	const APP_LINK_SC = "https://socialclub.rockstargames.com";

	if (friendMessage === undefined) friendMessage = "";
	if (checkBlocked === undefined) checkBlocked = true;
	if (debug === undefined) debug = false;

	try {
		var jqjs = document.createElement('script');
		jqjs.id = "nt-jqjs";
		jqjs.src = "https://cdnjs.cloudflare.com/ajax/libs/jquery/1.6.4/jquery.min.js";
		document.getElementsByTagName('head')[0].appendChild(jqjs);

		var sacss = document.createElement('link');
		sacss.id = "nt-sacss";
		sacss.rel = "stylesheet";
		sacss.href = "https://cdnjs.cloudflare.com/ajax/libs/sweetalert/1.1.3/sweetalert.min.css";
		document.getElementsByTagName('head')[0].appendChild(sacss);

		var sajs = document.createElement('script');
		sajs.id = "nt-sajs";
		sajs.src = "https://cdnjs.cloudflare.com/ajax/libs/sweetalert/1.1.3/sweetalert.min.js";
		document.getElementsByTagName('head')[0].appendChild(sajs);
	} catch (err) {
		if (debug) {
			console.groupCollapsed("Script loading FAIL");
			console.error(err);
			console.groupEnd();
		}

		return;
	}

	setTimeout(function () {
		if (window.location.href.startsWith(APP_LINK_SC)) {
			try {
				try {
					var verificationToken = siteMaster.aft.replace('<input name="__RequestVerificationToken" type="hidden" value="', '').replace('" />', '').trim();
					var userNickname = siteMaster.authUserNickName;
					var isLoggedIn = siteMaster.isLoggedIn;
				} catch (err) {
					if (debug) {
						console.groupCollapsed("Account data retrieval FAIL");
						console.error(err);
						console.groupEnd();
					}

					return;
				}

				if (userNickname != "" && isLoggedIn) {
					// Remove elements if they exist already.
					if (document.getElementById("nt-dam")) $("#nt-dam").remove();
					if (document.getElementById("nt-daf")) $("#nt-daf").remove();
					if (document.getElementById("nt-raf")) $("#nt-raf").remove();
					if (document.getElementById("nt-qa")) $("#nt-qa").remove();
					if (document.getElementById("nt-cred")) $("#nt-cred").remove();

					// Add elements to the DOM.
					$('<a id="nt-dam" class="btn btnGold btnRounded" href="#" style="margin-bottom: 8px;margin-right: 5px;">delete all messages</a>').prependTo('#page');
					$('<a id="nt-daf" class="btn btnGold btnRounded" href="#" style="margin-bottom: 8px;margin-right: 5px;">delete all friends</a>').prependTo('#page');
					$('<a id="nt-raf" class="btn btnGold btnRounded" href="#" style="margin-bottom: 8px;margin-right: 5px;">reject all friend requests</a>').prependTo('#page');
					$('<a id="nt-qa" class="btn btnGold btnRounded" href="#" style="margin-bottom: 8px;margin-right: 5px;">quick-add user</a>').prependTo('#page');
					$('<li id="nt-cred"><a href="'+APP_LINK+'" target="_blank">'+APP_NAME+' v'+APP_VERSION+'</a> by '+APP_AUTHOR+(debug ? " (debug mode)" : "")+'</li>').appendTo('#footerNav');

					// Add click listeners to the different elements.
					$("#nt-dam").click(function(e) {
						e.preventDefault();

						try {
							swal({
								allowEscapeKey: false,
								cancelButtonText: "No",
								closeOnConfirm: false,
								confirmButtonColor: "#DD6B55",
								confirmButtonText: "Yes",
								html: true,
								showCancelButton: true,
								showLoaderOnConfirm: true,
								text: "All messages will be deleted from your inbox.<br /><br />This process may take up to several minutes. Please be patient for it to be completed before browsing away from this page.<strong id=\"nt-dam-retrieving\" style=\"font-weight:bold;display:none;\"><br /><br />Retrieving <span id=\"nt-dam-retrieving-text\">conversation list</span>...</strong><strong id=\"nt-dam-progress\" style=\"font-weight:bold;display:none;\"><br /><br /><span id=\"nt-dam-progress-current\">0</span> of <span id=\"nt-dam-progress-total\">0</span> message(s) remaining...</strong>",
								title: "Are you sure?",
								type: "warning"
							},
							function(isConfirm){
								if (isConfirm) {
									$.ajax({
										url: APP_LINK_SC + "/Message/GetMessageCount",
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
												text: "Something went wrong while trying to fetch the total amount of messages.",
												title: err.status+" - "+err.statusText,
												timer: 5000,
												type: "error"
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
												$('#nt-dam-progress-current').text(data.Total);
												$('#nt-dam-progress-total').text(data.Total);
												$('#nt-dam-retrieving').show()
												RetrieveAllMessageUsers([]);
											} else {
												swal({
													allowOutsideClick: true,
													text: "There were no messages to delete.",
													title: "No messages",
													timer: 5000,
													type: "success"
												}); 
											}
										}
									});
								} else {
									return;
								}
							});
						} catch (err) {
							if (debug) {
								console.groupCollapsed("#nt-dam.click() FAIL");
								console.error(err);
								console.groupEnd();
							}

							return;
						}
					});

					$("#nt-raf").click(function(e) {
						e.preventDefault();

						try {
							swal({
								allowEscapeKey: false,
								cancelButtonText: "No",
								closeOnConfirm: false,
								confirmButtonColor: "#DD6B55",
								confirmButtonText: "Yes",
								html: true,
								showCancelButton: true,
								showLoaderOnConfirm: true,
								text: "All friend requests you have received will be rejected.<br /><br />This process may take up to several minutes. Please be patient for it to be completed before browsing away from this page.<strong id=\"nt-raf-progress\" style=\"font-weight:bold;display:none;\"><br /><br /><span id=\"nt-raf-progress-current\">0</span> of <span id=\"nt-raf-progress-total\">0</span> friend request(s) remaining...</strong>",
								title: "Are you sure?",
								type: "warning"
							},
							function(isConfirm){
								if (isConfirm) {
									var children = [];

									$.ajax({
										url: APP_LINK_SC + "/friends/GetReceivedInvitesJson",
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
												text: "Something went wrong while trying to fetch the total amount of friend requests.",
												title: err.status+" - "+err.statusText,
												timer: 5000,
												type: "error"
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
												$('#nt-raf-progress-current').text(data.TotalCount);
												$('#nt-raf-progress-total').text(data.TotalCount);
												$('#nt-raf-progress').show();

												data.RockstarAccounts.forEach(function(e) {
													children.push(e);
												});

												if (children.length == data.TotalCount) {
													RemoveFriend(children, true);
												};
											} else if (data.Status == true && data.TotalCount == 0) {
												swal({
													allowOutsideClick: true,
													text: "There were no friend requests to reject.",
													title: "No friend requests",
													timer: 5000,
													type: "success"
												});
											} else {
												swal({
													allowOutsideClick: true,
													text: "Something went wrong while trying to fetch friend request data.",
													title: "Something went wrong",
													timer: 5000,
													type: "error"
												});
											}
										}
									});
								} else {
									return;
								}
							});
						} catch (err) {
							if (debug) {
								console.groupCollapsed("#nt-raf.click() FAIL");
								console.error(err);
								console.groupEnd();
							}

							return;
						}
					});

					$("#nt-daf").click(function(e) {
						e.preventDefault();

						try {
							swal({
								allowEscapeKey: false,
								cancelButtonText: "No",
								closeOnConfirm: false,
								confirmButtonColor: "#DD6B55",
								confirmButtonText: "Yes",
								html: true,
								showCancelButton: true,
								showLoaderOnConfirm: true,
								text: "All friends will be removed from your friend list.<br /><br />This process may take up to several minutes. Please be patient for it to be completed before browsing away from this page.<strong id=\"nt-daf-retrieving\" style=\"font-weight:bold;display:none;\"><br /><br />Retrieving friends...</strong><strong id=\"nt-daf-progress\" style=\"font-weight:bold;display:none;\"><br /><br /><span id=\"nt-daf-progress-current\">0</span> of <span id=\"nt-daf-progress-total\">0</span> friend(s) remaining...</strong>",
								title: "Are you sure?",
								type: "warning"
							},
							function(isConfirm){
								if (isConfirm) {
									$.ajax({
										url: APP_LINK_SC + "/friends/GetFriendsAndInvitesSentJson?pageNumber=0&onlineService=sc&pendingInvitesOnly=false",
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
												text: "Something went wrong while trying to fetch the total amount of friends.",
												title: err.status+" - "+err.statusText,
												timer: 5000,
												type: "error"
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
												$('#nt-daf-progress-current').text(data.TotalCount);
												$('#nt-daf-progress-total').text(data.TotalCount);
												$('#nt-daf-retrieving').show();

												RetrieveAllFriends([]);
											} else if (data.Status == true && data.TotalCount == 0) {
												swal({
													allowOutsideClick: true,
													text: "There were no friends to delete.",
													title: "No friends",
													timer: 5000,
													type: "success"
												});
											} else {
												swal({
													allowOutsideClick: true,
													text: "Something went wrong while trying to fetch friend data.",
													title: "Something went wrong",
													timer: 5000,
													type: "error"
												});
											}
										}
									});
								} else {
									return;
								}
							});
						} catch (err) {
							if (debug) {
								console.groupCollapsed("#nt-daf.click() FAIL");
								console.error(err);
								console.groupEnd();
							}

							return;
						}
					});

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
								text: 'Please enter the Social Club username you want to add. When you click "Add", the user will automatically be added if it exists.'+(checkBlocked ? "" : "\n\nNote: You have disabled the blocked users list check. If the user is on your blocked users list, they will be unblocked and sent a friend request.")+(friendMessage.trim() == "" ? "" : "\n\nNote: You have set a custom friend request message, which will get sent to the user."),
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
									url: APP_LINK_SC + "/Friends/GetAccountDetails?nickname="+inputValue.trim()+"&full=false",
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
											type: "error"
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
											if (checkBlocked) {
												RetrieveBlockedList(data);
											} else {
												AddFriend(data);
											}
										} else {
											swal({
												allowOutsideClick: true,
												text: 'The nickname "'+inputValue+'" doesn\'t exist.',
												title: "User not found",
												timer: 5000,
												type: "warning"
											});
										}
									}
								});
							});
						} catch (err) {
							if (debug) {
								console.groupCollapsed("#nt-qa.click() FAIL");
								console.error(err);
								console.groupEnd();
							}

							return;
						}
					});

					// Utility functions.
					function RetrieveAllMessageUsers(source, pageIndex) {
						try {
							if (pageIndex === undefined) pageIndex = 0;

							setTimeout(function() {
								$.ajax({
									url: APP_LINK_SC + "/Message/GetConversationList?pageIndex="+pageIndex,
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
											text: "Something went wrong while trying to fetch the conversation list.",
											title: err.status+" - "+err.statusText,
											timer: 5000,
											type: "error"
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

											$('#nt-dam-retrieving-text').text("messages");

											RetrieveAllMessages(source);
										}
									}
								});
							}, 1000)
						} catch (err) {
							if (debug) {
								console.groupCollapsed("RetrieveAllMessageUsers FAIL");
								console.error(err);
								console.groupEnd();
							}

							return;
						}
					}

					function RetrieveAllMessages(source, target) {
						try {
							if (target === undefined) target = [];

							setTimeout(function() {
								var item = source.pop();
								if (item === undefined) {
									if (debug) console.log("RetrieveAllMessages() SKIP undefined")
									RetrieveAllMessages(source, target);
									return;
								}

								if (debug) {
									console.groupCollapsed("RetrieveAllMessages() POP");
									console.group("Item");
									console.log(item);
									console.groupEnd();
									console.groupEnd();
								};

								$.ajax({
									url: APP_LINK_SC + "/Message/GetMessages?rockstarId="+item.RockstarId,
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

											$('#nt-dam-retrieving').hide();
											$('#nt-dam-progress').show();

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

											$('#nt-dam-retrieving').hide();
											$('#nt-dam-progress').show();

											RemoveMessage(target);
										}
									}
								});
							}, 1000)
						} catch (err) {
							if (debug) {
								console.groupCollapsed("RetrieveAllMessages FAIL");
								console.error(err);
								console.groupEnd();
							}

							return;
						}
					}

					function RemoveMessage(source) {
						try {
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
									url: APP_LINK_SC + "/Message/DeleteMessage",
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
											$('#nt-dam-progress-current').text(source.length);

											RemoveMessage(source);
										} else {
											swal({
												allowOutsideClick: true,
												text: "All of the messages in your inbox should have been removed.\n\nYou can see exactly which friends have been removed and which ones haven't by opening the console (F12). To view the changes to your inbox, please browse to your inbox.",
												title: "Messages removed",
												timer: 5000,
												type: "success"
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
											if (item.ScNickname != undefined) {
												if (item.ScNickname.toLowerCase() === userNickname.toLowerCase()) {
													console.info("A message you sent to someone has been removed.");
												} else {
													console.info("A message " + item.ScNickname + " sent to you has been removed.");
												}
											} else {
												console.info("A message someone sent to you has been removed.");
											}
										} else {
											if (item.ScNickname != undefined) {
												if (item.ScNickname.toLowerCase() === userNickname.toLowerCase()) {
													console.info("A message you sent to someone could not be removed.");
												} else {
													console.info("A message " + item.ScNickname + " sent to you could not be removed.");
												}
											} else {
												console.info("A message someone sent to you could not be removed.");
											}
										}

										if (source.length > 0) {
											$('#nt-dam-progress-current').text(source.length);

											RemoveMessage(source);
										} else {
											swal({
												allowOutsideClick: true,
												text: "All of the messages in your inbox should have been removed.\n\nYou can see exactly which friends have been removed and which ones haven't by opening the console (F12). To view the changes to your inbox, please browse to your inbox.",
												title: "Messages removed",
												timer: 5000,
												type: "success"
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
							if (debug) {
								console.groupCollapsed("RemoveMessage FAIL");
								console.error(err);
								console.groupEnd();
							}

							return;
						}
					}

					function RetrieveAllFriends(source, pageIndex) {
						try {
							if (pageIndex === undefined) pageIndex = 0;

							setTimeout(function() {
								$.ajax({
									url: APP_LINK_SC + "/friends/GetFriendsAndInvitesSentJson?pageNumber="+pageIndex+"&onlineService=sc&pendingInvitesOnly=false",
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
											type: "error"
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
												type: "error"
											});
										}

										if (source.length < data.TotalCount) {
											RetrieveAllFriends(source, (pageIndex + 1));
										} else {
											if (debug) console.log("RetrieveAllFriends() complete.");

											$('#nt-daf-retrieving').hide();
											$('#nt-daf-progress').show();

											RemoveFriend(source);
										}
									}
								});
							}, 1000)
						} catch (err) {
							if (debug) {
								console.groupCollapsed("RetrieveAllFriends FAIL");
								console.error(err);
								console.groupEnd();
							}

							return;
						}
					}

					function RemoveFriend(source, isFriendRequestLoop) {
						try {
							if (isFriendRequestLoop === undefined) isFriendRequestLoop = false;

							setTimeout(function() {
								var item = source.pop();
								if (item === undefined) {
									if (debug) console.log("RemoveFriend() SKIP undefined")
									RemoveFriend(source, isFriendRequestLoop);
									return;
								}

								if (debug) {
									console.groupCollapsed("RemoveFriend() POP");
									console.group("Item");
									console.log(item);
									console.groupEnd();
									console.groupEnd();
								};

								if (item.AllowDelete === true) {
									$.ajax({
										url: APP_LINK_SC + "/friends/UpdateFriend",
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

											if (source.length > 0) {
												if (isFriendRequestLoop) {
													$('#nt-raf-progress-current').text(source.length);
												} else {
													$('#nt-daf-progress-current').text(source.length);
												}

												RemoveFriend(source);
											} else {
												if (isFriendRequestLoop) {
													swal({
														allowOutsideClick: true,
														text: "All friend requests you received should have been rejected.\n\nYou can see exactly which friends have been removed and which ones haven't by opening the console (F12). To view the changes to your friends list, please refresh the page.",
														title: "Friend requests rejected",
														timer: 5000,
														type: "success"
													});
												} else {
													swal({
														allowOutsideClick: true,
														text: "All your friends should have been removed.\n\nYou can see exactly which friends have been removed and which ones haven't by opening the console (F12). To view the changes to your friends list, please refresh the page.",
														title: "Friends removed",
														timer: 5000,
														type: "success"
													});
												}
											}
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
												if (isFriendRequestLoop) {
													$('#nt-raf-progress-current').text(source.length);
												} else {
													$('#nt-daf-progress-current').text(source.length);
												}

												RemoveFriend(source);
											} else {
												if (isFriendRequestLoop) {
													swal({
														allowOutsideClick: true,
														text: "All friend requests you received should have been rejected.\n\nYou can see exactly which friends have been removed and which ones haven't by opening the console (F12). To view the changes to your friends list, please refresh the page.",
														title: "Friend requests rejected",
														timer: 5000,
														type: "success"
													});
												} else {
													swal({
														allowOutsideClick: true,
														text: "All your friends should have been removed.\n\nYou can see exactly which friends have been removed and which ones haven't by opening the console (F12). To view the changes to your friends list, please refresh the page.",
														title: "Friends removed",
														timer: 5000,
														type: "success"
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
										url: APP_LINK_SC + "/friends/UpdateFriend",
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

											if (source.length > 0) {
												if (isFriendRequestLoop) {
													$('#nt-raf-progress-current').text(source.length);
												} else {
													$('#nt-daf-progress-current').text(source.length);
												}

												RemoveFriend(source);
											} else {
												if (isFriendRequestLoop) {
													swal({
														allowOutsideClick: true,
														text: "All friend requests you received should have been rejected.\n\nYou can see exactly which friends have been removed and which ones haven't by opening the console (F12). To view the changes to your friends list, please refresh the page.",
														title: "Friend requests rejected",
														timer: 5000,
														type: "success"
													});
												} else {
													swal({
														allowOutsideClick: true,
														text: "All your friends should have been removed.\n\nYou can see exactly which friends have been removed and which ones haven't by opening the console (F12). To view the changes to your friends list, please refresh the page.",
														title: "Friends removed",
														timer: 5000,
														type: "success"
													});
												}
											}
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
												if (isFriendRequestLoop) {
													$('#nt-raf-progress-current').text(source.length);
												} else {
													$('#nt-daf-progress-current').text(source.length);
												}

												RemoveFriend(source);
											} else {
												if (isFriendRequestLoop) {
													swal({
														allowOutsideClick: true,
														text: "All friend requests you received should have been rejected.\n\nYou can see exactly which friends have been removed and which ones haven't by opening the console (F12). To view the changes to your friends list, please refresh the page.",
														title: "Friend requests rejected",
														timer: 5000,
														type: "success"
													});
												} else {
													swal({
														allowOutsideClick: true,
														text: "All your friends should have been removed.\n\nYou can see exactly which friends have been removed and which ones haven't by opening the console (F12). To view the changes to your friends list, please refresh the page.",
														title: "Friends removed",
														timer: 5000,
														type: "success"
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
										url: APP_LINK_SC + "/friends/UpdateFriend",
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

											if (source.length > 0) {
												if (isFriendRequestLoop) {
													$('#nt-raf-progress-current').text(source.length);
												} else {
													$('#nt-daf-progress-current').text(source.length);
												}

												RemoveFriend(source);
											} else {
												if (isFriendRequestLoop) {
													swal({
														allowOutsideClick: true,
														text: "All friend requests you received should have been rejected.\n\nYou can see exactly which friends have been removed and which ones haven't by opening the console (F12). To view the changes to your friends list, please refresh the page.",
														title: "Friend requests rejected",
														timer: 5000,
														type: "success"
													});
												} else {
													swal({
														allowOutsideClick: true,
														text: "All your friends should have been removed.\n\nYou can see exactly which friends have been removed and which ones haven't by opening the console (F12). To view the changes to your friends list, please refresh the page.",
														title: "Friends removed",
														timer: 5000,
														type: "success"
													});
												}
											}
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
												if (isFriendRequestLoop) {
													$('#nt-raf-progress-current').text(source.length);
												} else {
													$('#nt-daf-progress-current').text(source.length);
												}

												RemoveFriend(source);
											} else {
												if (isFriendRequestLoop) {
													swal({
														allowOutsideClick: true,
														text: "All friend requests you received should have been rejected.\n\nYou can see exactly which friends have been removed and which ones haven't by opening the console (F12). To view the changes to your friends list, please refresh the page.",
														title: "Friend requests rejected",
														timer: 5000,
														type: "success"
													});
												} else {
													swal({
														allowOutsideClick: true,
														text: "All your friends should have been removed.\n\nYou can see exactly which friends have been removed and which ones haven't by opening the console (F12). To view the changes to your friends list, please refresh the page.",
														title: "Friends removed",
														timer: 5000,
														type: "success"
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
										if (isFriendRequestLoop) {
											$('#nt-raf-progress-current').text(source.length);
										} else {
											$('#nt-daf-progress-current').text(source.length);
										}

										RemoveFriend(source);
									} else {
										if (isFriendRequestLoop) {
											swal({
												allowOutsideClick: true,
												text: "All friend requests you received should have been rejected.\n\nYou can see exactly which friends have been removed and which ones haven't by opening the console (F12). To view the changes to your friends list, please refresh the page.",
												title: "Friend requests rejected",
												timer: 5000,
												type: "success"
											});
										} else {
											swal({
												allowOutsideClick: true,
												text: "All your friends should have been removed.\n\nYou can see exactly which friends have been removed and which ones haven't by opening the console (F12). To view the changes to your friends list, please refresh the page.",
												title: "Friends removed",
												timer: 5000,
												type: "success"
											});
										}
									}
								}
							}, 1000)
						} catch (err) {
							if (debug) {
								console.groupCollapsed("RemoveFriend FAIL");
								console.error(err);
								console.groupEnd();
							}

							return;
						}
					}

					function RetrieveBlockedList(source) {
						try {
							var target = [];

							setTimeout(function() {
								$.ajax({
									url: APP_LINK_SC + "/friends/GetBlockedJson",
									headers: {
										"Accept": "application/json",
										"RequestVerificationToken": verificationToken
									},
									error: function(err){
										if (debug) {
											console.groupCollapsed("GetBlockedJson AJAX FAIL");
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
											text: "Something went wrong while trying to retrieve blocked users.",
											title: err.status+" - "+err.statusText,
											timer: 5000,
											type: "error"
										});
									},
									success: function(data){
										if (debug) {
											console.groupCollapsed("GetBlockedJson AJAX OK");
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
												if (e !== undefined) target.push(e);
											});

											var obj = target.filter(function(obj) {
												return obj.Name.trim().toLowerCase() === source.Nickname.trim().toLowerCase();
											})[0];

											if (obj == undefined) {
												AddFriend(source);
											} else {
												swal({
													allowOutsideClick: true,
													text: source.Nickname+" is on your blocked users list. To be able to send them a friend request, remove them from your blocked users list, then try again.",
													title: "User blocked",
													timer: 5000,
													type: "warning"
												});
											}
										} else {
											swal({
												allowOutsideClick: true,
												text: "Something went wrong while trying to retrieve blocked users.",
												title: "Something went wrong",
												timer: 5000,
												type: "error"
											});
										}
									}
								});
							}, 1000)
						} catch (err) {
							if (debug) {
								console.groupCollapsed("RetrieveBlockedList FAIL");
								console.error(err);
								console.groupEnd();
							}

							return;
						}
					}

					function AddFriend(source) {
						try {
							$.ajax({
								url: APP_LINK_SC + "/friends/UpdateFriend",
								type: "PUT",
								data: '{"id":'+source.RockstarId+',"op":"addfriend","custommessage":"'+friendMessage.trim().replace(/\s\s+/g, ' ')+'"}',
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
										type: "error"
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
											type: "success"
										});
									} else {
										swal({
											allowOutsideClick: true,
											text: 'Something went wrong trying to add "' + source.Nickname + '".',
											title: "Something went wrong",
											timer: 5000,
											type: "error"
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
							if (debug) {
								console.groupCollapsed("AddFriend FAIL");
								console.error(err);
								console.groupEnd();
							}

							return;
						}
					}

					$.getJSON("https://raw.githubusercontent.com/Senexis/Social-Club-Tool/master/v.json?callback", function(json) {
						if (debug) {
							console.groupCollapsed("Update retrieval OK");
							console.group("Response");
							console.log(json);
							console.groupEnd();
							console.groupEnd();
						}
					})
					.success(function(json) {
						if (json.version != APP_VERSION && json.released) {
							swal({
								allowOutsideClick: true,
								html: true,
								text: "<p style=\"margin-bottom:0.6em\">"+APP_NAME+" <strong style=\"font-weight:bold\">version "+json.version+"</strong> is now available!</p><p style=\"margin-bottom:0.6em\">It was released on "+json.date+" and contains the following changes:</p><ul style=\"list-style:initial\"><li>"+json.changes.replace('|', '</li><li>')+"</li></ul><p style=\"margin:0.6em 0\">Update your bookmark to the following:</p><textarea style=\"padding:0.5em;width:100%;height:7em;border:solid 2px #f90;text-align:center\">javascript:(function(){if(!document.getElementById(\"nt-mtjs\")){var mtjs=document.createElement(\"script\");mtjs.id=\"nt-mtjs\",mtjs.src=\""+json.link+"\",document.getElementsByTagName(\"head\")[0].appendChild(mtjs)}setTimeout(function(){try{Init(\""+friendMessage+"\","+checkBlocked+","+debug+")}}catch(err){alert(\"Couldn't load Social Club Utility Tool in time, which sometimes happens when the connection is slow. Please click your bookmark again.\")},1e3);})();</textarea>",
								title: "Update available!",
								timer: 20000,
								type: "warning"
							});
						} else {
							swal({
								allowOutsideClick: true,
								text: APP_NAME + " was loaded successfully!",
								title: "Loaded",
								timer: 3000,
								type: "success"
							});
						}
					})
					.error(function(err) {
						swal({
							allowOutsideClick: true,
							text: APP_NAME + " was loaded successfully!",
							title: "Loaded",
							timer: 3000,
							type: "success"
						});

						if (debug) {
							console.groupCollapsed("Update retrieval FAIL");
							console.error(err);
							console.groupEnd();
						}
					});

				} else {
					swal({
						allowOutsideClick: true,
						text: APP_NAME + " requires you to log in to be able to apply changes to your account. Please log into the account you want to use with "+APP_NAME+", then click the bookmark again.",
						title: "Log in required",
						type: "warning"
					});
				}
			} catch (err) {
				if (err instanceof DOMException) {
					swal({
						allowOutsideClick: true,
						html: true,
						text: APP_NAME + " was not loaded correctly. Please try clicking the bookmark again without refreshing the page.",
						title: "Load unsuccessful",
						type: "error",
					});
				} else {
					swal({
						allowOutsideClick: true,
						text: APP_NAME + " was unable to complete your request. Please try clicking the bookmark again. If the problem persists, please <a href=\""+APP_LINK_ISSUES+"\" target=\"_blank\">submit an issue</a>.",
						title: "An error occured",
						type: "error"
					});

					if (debug) {
						console.groupCollapsed("General FAIL");
						console.error(err);
						console.groupEnd();
					};
				}
				return;
			}
		} else {
			swal({
				allowOutsideClick: true,
				cancelButtonText: "No",
				closeOnConfirm: false,
				confirmButtonText: "Yes",
				showCancelButton: true,
				text: "Whoops, you accidentally activated "+APP_NAME+" on a wrong web page. To use "+APP_NAME+", first browse to the correct page, then click the bookmark again.\n\nDo you want to go to the Social Club main page now?",
				title: "Wrong site",
				type: "warning"
			}, function(){ window.location.href = APP_LINK_SC });
		}
	}, 1000);
}
