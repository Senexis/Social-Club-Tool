function Init(friendMessage, checkBlocked, debug) {
	const APP_VERSION = "1.2";
	const APP_NAME = "Social Club Utility Tool";
	const APP_AUTHOR = "Senexys";
	const APP_LINK = "https://github.com/Senexis/Social-Club-Tool";
	const APP_LINK_ISSUES = "https://github.com/Senexis/Social-Club-Tool/issues/new";
	const APP_LINK_VERSIONS = "https://raw.githubusercontent.com/Senexis/Social-Club-Tool/master/v.json?callback";
	const APP_LINK_SC = "https://socialclub.rockstargames.com";
	const APP_DEBUG = debug;

	if (friendMessage === undefined) friendMessage = "";
	friendMessage = friendMessage.replace('\"', '').replace(/\s\s+/g, ' ').trim();

	if (checkBlocked === undefined) checkBlocked = 1;

	function logGeneric(title, body) {
		if (APP_DEBUG === undefined) return;

		console.groupCollapsed(title);
		console.log(body);
		console.groupEnd();
	}

	function logError(title, body) {
		console.groupCollapsed(title);
		console.error(body);
		console.groupEnd();
	}

	function logRequest(title, request, response) {
		if (APP_DEBUG === undefined) return;

		console.groupCollapsed(title);
		console.group("Request");
		console.log(request);
		console.groupEnd();
		console.group("Response");
		console.log(response);
		console.groupEnd();
		console.groupEnd();
	}

	function getYesNoSwalArgs(type, title, body) {
		return {
			type: type,
			title: title,
			text: body,

			allowEscapeKey: false,
			cancelButtonText: "No",
			closeOnConfirm: false,
			confirmButtonColor: "#DD6B55",
			confirmButtonText: "Yes",
			html: true,
			showCancelButton: true,
			showLoaderOnConfirm: true
		};
	}

	function getTimedSwalArgs(type, title, body) {
		return {
			type: type,
			title: title,
			text: body,

			allowOutsideClick: true,
			html: true,
			timer: 5000
		};
	}

	function getPersistentSwalArgs(type, title, body) {
		return {
			type: type,
			title: title,
			text: body,

			allowEscapeKey: false,
			allowOutsideClick: false,
			html: true
		};
	}

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
		logError("Script loading FAIL", err);
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
					logError("Account data retrieval FAIL", err);
					return;
				}

				if (userNickname != "" && isLoggedIn) {
					// Insert custom styling.
					$('<style>#nt-daf,#nt-dam,#nt-qa,#nt-raf{margin-bottom:8px;margin-right:5px}#nt-update{padding:.5em;width:100%;height:10em;border:2px solid #f90;text-align:center;resize:none;background:0 0;cursor:initial}.sweet-alert p{margin:12px 0!important}.sweet-alert strong{font-weight:700!important}.sweet-alert ul{list-style:outside}.sweet-alert fieldset{display:none}.sweet-alert.show-input fieldset{display:block}.sweet-alert .sa-input-error{top:40px}</style>').appendTo('head');

					// Remove elements if they exist already.
					if (document.getElementById("nt-dam")) $("#nt-dam").remove();
					if (document.getElementById("nt-daf")) $("#nt-daf").remove();
					if (document.getElementById("nt-raf")) $("#nt-raf").remove();
					if (document.getElementById("nt-qa")) $("#nt-qa").remove();
					if (document.getElementById("nt-cred")) $("#nt-cred").remove();

					// Add elements to the DOM.
					$('<a id="nt-dam" class="btn btnGold btnRounded" href="javascript:void(0)">delete all messages</a>').prependTo('#page');
					$('<a id="nt-daf" class="btn btnGold btnRounded" href="javascript:void(0)">delete all friends</a>').prependTo('#page');
					$('<a id="nt-raf" class="btn btnGold btnRounded" href="javascript:void(0)">reject all friend requests</a>').prependTo('#page');
					$('<a id="nt-qa" class="btn btnGold btnRounded" href="javascript:void(0)">quick-add user</a>').prependTo('#page');
					$('<li id="nt-cred"><a href="'+APP_LINK+'" target="_blank">'+APP_NAME+' v'+APP_VERSION+'</a> by '+APP_AUTHOR+'</li>').appendTo('#footerNav');

					// Add click listeners to the different elements.
					$("#nt-dam").click(function (e) {
						e.preventDefault();

						try {
							swal(
								getYesNoSwalArgs(
									"warning",
									"Are you sure?",
									"<p>All messages will be deleted from your inbox.</p><p>This process may take up to several minutes. Please be patient for it to be completed before browsing away from this page.</p><p><strong id=\"nt-dam-retrieving\" style=\"display:none;\">Retrieving <span id=\"nt-dam-retrieving-text\">conversation list</span>...</strong></p><p><strong id=\"nt-dam-progress\" style=\"display:none;\"><span id=\"nt-dam-progress-current\">0</span> of <span id=\"nt-dam-progress-total\">0</span> message(s) remaining...</strong></p>"
								),
								function (isConfirm) {
									if (isConfirm) {
										$.ajax({
											url: APP_LINK_SC + "/Message/GetMessageCount",
											headers: {
												"Accept": "application/json",
												"RequestVerificationToken": verificationToken
											},
											error: function (err) {
												logRequest("GetMessageCount AJAX FAIL", this, err);

												swal(
													getTimedSwalArgs(
														"error",
														err.status + " - " + err.statusText,
														"Something went wrong while trying to fetch the total amount of messages."
													)
												);
											},
											success: function (data) {
												logRequest("GetMessageCount AJAX OK", this, data);

												if (data.Total > 0) {
													$('#nt-dam-progress-current').text(data.Total);
													$('#nt-dam-progress-total').text(data.Total);
													$('#nt-dam-retrieving').show()
													RetrieveAllMessageUsers([]);
												} else {
													swal(
														getTimedSwalArgs(
															"success",
															"No messages",
															"There were no messages to delete."
														)
													); 
												}
											}
										});
									} else {
										return false;
									}
								}
							);
						} catch (err) {
							logError("#nt-dam.click() FAIL", err);
							return false;
						}

						return false;
					});

					$("#nt-raf").click(function (e) {
						e.preventDefault();

						try {
							swal(
								getYesNoSwalArgs(
									"warning",
									"Are you sure?",
									"<p>All friend requests you have received will be rejected.</p><p>This process may take up to several minutes. Please be patient for it to be completed before browsing away from this page.</p><p><strong id=\"nt-raf-progress\" style=\"display:none;\"><span id=\"nt-raf-progress-current\">0</span> of <span id=\"nt-raf-progress-total\">0</span> friend request(s) remaining...</strong></p>"
								),
								function (isConfirm) {
									if (isConfirm) {
										var children = [];

										$.ajax({
											url: APP_LINK_SC + "/friends/GetReceivedInvitesJson",
											headers: {
												"Accept": "application/json",
												"RequestVerificationToken": verificationToken
											},
											error: function (err) {
												logRequest("GetReceivedInvitesJson AJAX FAIL", this, err);

												swal(
													getTimedSwalArgs(
														"error",
														err.status + " - " + err.statusText,
														"Something went wrong while trying to fetch the total amount of friend requests."
													)
												);
											},
											success: function (data) {
												logRequest("GetReceivedInvitesJson AJAX OK", this, data);

												if (data.Status == true && data.TotalCount > 0) {
													$('#nt-raf-progress-current').text(data.TotalCount);
													$('#nt-raf-progress-total').text(data.TotalCount);
													$('#nt-raf-progress').show();

													data.RockstarAccounts.forEach(function (e) {
														children.push(e);
													});

													if (children.length == data.TotalCount) {
														RemoveFriend(children, true);
													};
												} else if (data.Status == true && data.TotalCount == 0) {
													swal(
														getTimedSwalArgs(
															"success",
															"No friend requests",
															"There were no friend requests to reject."
														)
													);
												} else {
													swal(
														getTimedSwalArgs(
															"error",
															"Something went wrong",
															"Something went wrong while trying to fetch friend request data."
														)
													);
												}
											}
										});
									} else {
										return false;
									}
								}
							);
						} catch (err) {
							logError("#nt-raf.click() FAIL", err);
							return false;
						}

						return false;
					});

					$("#nt-daf").click(function (e) {
						e.preventDefault();

						try {
							swal(
								getYesNoSwalArgs(
									"warning",
									"Are you sure?",
									"<p>All friends will be removed from your friend list.<p></p>This process may take up to several minutes. Please be patient for it to be completed before browsing away from this page.</p><p><strong id=\"nt-daf-retrieving\" style=\"display:none;\">Retrieving friends...</strong></p><p><strong id=\"nt-daf-progress\" style=\"display:none;\"><span id=\"nt-daf-progress-current\">0</span> of <span id=\"nt-daf-progress-total\">0</span> friend(s) remaining...</strong></p>",
								),
								function (isConfirm) {
									if (isConfirm) {
										$.ajax({
											url: APP_LINK_SC + "/friends/GetFriendsAndInvitesSentJson?pageNumber=0&onlineService=sc&pendingInvitesOnly=false",
											headers: {
												"Accept": "application/json",
												"RequestVerificationToken": verificationToken
											},
											error: function (err) {
												logRequest("GetFriendsAndInvitesSentJson AJAX FAIL", this, err);

												swal(
													getTimedSwalArgs(
														"error",
														err.status + " - " + err.statusText,
														"Something went wrong while trying to fetch the total amount of friends."
													)
												);
											},
											success: function (data) {
												logRequest("GetFriendsAndInvitesSentJson AJAX OK", this, data);

												if (data.Status == true && data.TotalCount > 0) {
													$('#nt-daf-progress-current').text(data.TotalCount);
													$('#nt-daf-progress-total').text(data.TotalCount);
													$('#nt-daf-retrieving').show();

													RetrieveAllFriends([]);
												} else if (data.Status == true && data.TotalCount == 0) {
													swal(
														getTimedSwalArgs(
															"success",
															"No friends",
															"There were no friends to delete."
														)
													);
												} else {
													swal(
														getTimedSwalArgs(
															"error",
															"Something went wrong",
															"Something went wrong while trying to fetch friend data."
														)
													);
												}
											}
										});
									} else {
										return false;
									}
								}
							);
						} catch (err) {
							logError("#nt-daf.click() FAIL", err);
							return false;
						}

						return false;
					});

					$("#nt-qa").click(function (e) {
						e.preventDefault();

						try {
							swal({
								type: "input",
								title: "Enter username",
								html: true,
								text: '<p>Please enter the Social Club username you want to add. When you click "Add", the user will automatically be added if it exists.</p>'+(checkBlocked ? "" : "<p><strong>Note:</strong> You have disabled the blocked users list check. If the user is on your blocked users list, they will be unblocked and sent a friend request.</p>")+(friendMessage == "" ? "" : "<p><strong>Note:</strong> You have set a custom friend request message, which will get sent to the user.</p>"),

								allowEscapeKey: false,
								closeOnConfirm: false,
								confirmButtonText: "Add",
								inputPlaceholder: "Social Club username",
								showCancelButton: true,
								showLoaderOnConfirm: true
							},
							function (inputValue) {
								if (inputValue === false) return false;
								inputValue = inputValue.trim();

								if (inputValue === "") {
									swal.showInputError("The username field can't be empty.");
									return false
								}

								if (inputValue.match(new RegExp("([^A-Za-z0-9-_\.])"))) {
									swal.showInputError("The username field contains invalid characters.");
									return false
								}

								if (inputValue.length < 6) {
									swal.showInputError("The username field can't be shorter than 6 characters.");
									return false
								}

								if (inputValue.length > 16) {
									swal.showInputError("The username field can't be longer than 16 characters.");
									return false
								}

								if (inputValue.toLowerCase() === userNickname.toLowerCase()) {
									swal.showInputError("You can't add yourself as a friend.");
									return false
								}

								$.ajax({
									url: APP_LINK_SC + "/Friends/GetAccountDetails?nickname=" + inputValue + "&full=false",
									headers: {
										"Accept": "application/json",
										"RequestVerificationToken": verificationToken
									},
									error: function (err) {
										logRequest("GetAccountDetails AJAX FAIL", this, err);

										swal(
											getTimedSwalArgs(
												"error",
												err.status + " - " + err.statusText,
												"Something went wrong while trying to check whether <strong>" + inputValue + "</strong> exists or not."
											)
										);
									},
									success: function (data) {
										logRequest("GetAccountDetails AJAX OK", this, data);

										if (data.Status == true) {
											if (checkBlocked) {
												RetrieveBlockedList(data);
											} else {
												AddFriend(data);
											}
										} else {
											swal(
												getTimedSwalArgs(
													"warning",
													"User not found",
													"The nickname <strong>" + inputValue + "</strong> doesn't exist."
												)
											);
										}
									}
								});
							});
						} catch (err) {
							logError("#nt-qa.click() FAIL", err);
							return false;
						}

						return false;
					});

					// Utility functions.
					function RetrieveAllMessageUsers(source, pageIndex) {
						try {
							if (pageIndex === undefined) pageIndex = 0;

							setTimeout(function () {
								$.ajax({
									url: APP_LINK_SC + "/Message/GetConversationList?pageIndex="+pageIndex,
									headers: {
										"Accept": "application/json",
										"RequestVerificationToken": verificationToken
									},
									error: function (err) {
										logRequest("GetConversationList AJAX FAIL", this, err);

										swal(
											getTimedSwalArgs(
												"error",
												err.status + " - " + err.statusText,
												"Something went wrong while trying to fetch the conversation list."
											)
										);
									},
									success: function (data) {
										logRequest("GetConversationList AJAX OK", this, data);

										data.Users.forEach(function (e) {
											source.push(e);
										});

										if (data.HasMore === true) {
											RetrieveAllMessageUsers(source, data.NextPageIndex);
										} else {
											$('#nt-dam-retrieving-text').text("messages");
											RetrieveAllMessages(source);
										}
									}
								});
							}, 1000)
						} catch (err) {
							logError("RetrieveAllMessageUsers FAIL", err);
							return;
						}
					}

					function RetrieveAllMessages(source, target) {
						try {
							if (target === undefined) target = [];

							setTimeout(function () {
								var item = source.pop();
								if (item === undefined) {
									RetrieveAllMessages(source, target);
									return;
								}

								logGeneric("RetrieveAllMessages() POP", item);

								$.ajax({
									url: APP_LINK_SC + "/Message/GetMessages?rockstarId="+item.RockstarId,
									headers: {
										"Accept": "application/json",
										"RequestVerificationToken": verificationToken
									},
									error: function (err) {
										logRequest("GetMessages AJAX FAIL", this, err);

										if (source.length > 0) {
											RetrieveAllMessages(source, target);
										} else if (target.length > 0) {
											$('#nt-dam-retrieving').hide();
											$('#nt-dam-progress').show();
											RemoveMessage(target);
										}
									},
									success: function (data) {
										logRequest("GetMessages AJAX OK", this, data);

										target = target.concat(data.Messages);

										if (source.length > 0) {
											RetrieveAllMessages(source, target);
										} else if (target.length > 0) {
											$('#nt-dam-retrieving').hide();
											$('#nt-dam-progress').show();
											RemoveMessage(target);
										}
									}
								});
							}, 1000)
						} catch (err) {
							logError("RetrieveAllMessages FAIL", err);
							return;
						}
					}

					function RemoveMessage(source) {
						try {
							setTimeout(function () {
								var item = source.pop();
								if (item === undefined) {
									RemoveMessage(source);
									return;
								}

								logGeneric("RemoveMessage() POP", item);

								$.ajax({
									url: APP_LINK_SC + "/Message/DeleteMessage",
									type: "POST",
									data: '{"messageid":'+item.ID+',"isAdmin":'+item.IsAdminMessage+'}',
									headers: {
										"Content-Type": "application/json",
										"RequestVerificationToken": verificationToken
									},
									error: function (err) {
										logRequest("DeleteMessage AJAX FAIL", this, err);

										if (item.ScNickname.toLowerCase() === userNickname.toLowerCase()) {
											logError("A message you sent to someone could not be removed.", err);
										} else {
											logError("A message " + item.ScNickname + " sent to you could not be removed.", err);
										}

										if (source.length > 0) {
											$('#nt-dam-progress-current').text(source.length);
											RemoveMessage(source);
										} else {
											swal(
												getTimedSwalArgs(
													"success",
													"Messages removed",
													"<p>All of the messages in your inbox should have been removed.</p><p>You can see exactly which friends have been removed and which ones haven't by opening the console (F12). To view the changes to your inbox, please browse to your inbox.</p>"
												)
											);
										}
									},
									success: function (data) {
										logRequest("DeleteMessage AJAX OK", this, data);

										if (data.Status == true) {
											if (item.ScNickname != undefined) {
												if (item.ScNickname.toLowerCase() === userNickname.toLowerCase()) {
													logGeneric("A message you sent to someone has been removed.");
												} else {
													logGeneric("A message " + item.ScNickname + " sent to you has been removed.");
												}
											} else {
												logGeneric("A message someone sent to you has been removed.");
											}
										} else {
											if (item.ScNickname != undefined) {
												if (item.ScNickname.toLowerCase() === userNickname.toLowerCase()) {
													logError("A message you sent to someone could not be removed.", "data.Status != true");
												} else {
													logError("A message " + item.ScNickname + " sent to you could not be removed.", "data.Status != true");
												}
											} else {
												logError("A message someone sent to you could not be removed.", "data.Status != true");
											}
										}

										if (source.length > 0) {
											$('#nt-dam-progress-current').text(source.length);

											RemoveMessage(source);
										} else {
											swal(
												getTimedSwalArgs(
													"success",
													"Messages removed",
													"<p>All of the messages in your inbox should have been removed.</p><p>You can see exactly which friends have been removed and which ones haven't by opening the console (F12). To view the changes to your inbox, please browse to your inbox.</p>"
												)
											);
										}
									},
									xhr: function () {
										var xhr = jQuery.ajaxSettings.xhr();
										var setRequestHeader = xhr.setRequestHeader;
										
										xhr.setRequestHeader = function (name, value) {
											if (name == 'X-Requested-With') return;
											setRequestHeader.call(this, name, value);
										}

										return xhr;
									}
								});
							}, 1000)
						} catch (err) {
							logError("RemoveMessage FAIL", err);
							return;
						}
					}

					function RetrieveAllFriends(source, pageIndex) {
						try {
							if (pageIndex === undefined) pageIndex = 0;

							setTimeout(function () {
								$.ajax({
									url: APP_LINK_SC + "/friends/GetFriendsAndInvitesSentJson?pageNumber=" + pageIndex + "&onlineService=sc&pendingInvitesOnly=false",
									headers: {
										"Accept": "application/json",
										"RequestVerificationToken": verificationToken
									},
									error: function (err) {
										logRequest("GetFriendsAndInvitesSentJson AJAX FAIL", this, err);

										swal(
											getTimedSwalArgs(
												"error",
												err.status + " - " + err.statusText,
												"Something went wrong while trying to fetch data from page " + pageIndex + "."
											)
										);
									},
									success: function (data) {
										logRequest("GetFriendsAndInvitesSentJson AJAX OK", this, data);

										if (data.Status == true) {
											data.RockstarAccounts.forEach(function (e) {
												if (e !== undefined) source.push(e);
											});
										} else {
											swal(
												getTimedSwalArgs(
													"error",
													"Something went wrong",
													"Something went wrong while trying to fetch data from page " + pageIndex + "."
												)
											);
										}

										if (source.length < data.TotalCount) {
											RetrieveAllFriends(source, (pageIndex + 1));
										} else {
											$('#nt-daf-retrieving').hide();
											$('#nt-daf-progress').show();
											RemoveFriend(source);
										}
									}
								});
							}, 1000)
						} catch (err) {
							logError("RetrieveAllFriends FAIL", err);
							return;
						}
					}

					function RemoveFriend(source, isFriendRequestLoop) {
						try {
							if (isFriendRequestLoop === undefined) isFriendRequestLoop = false;

							setTimeout(function () {
								var item = source.pop();
								if (item === undefined) {
									RemoveFriend(source, isFriendRequestLoop);
									return;
								}

								logGeneric("RemoveFriend() POP", item);

								if (item.AllowDelete === true) {
									$.ajax({
										url: APP_LINK_SC + "/friends/UpdateFriend",
										type: "PUT",
										data: '{"id":'+item.RockstarId+',"op":"delete"}',
										headers: {
											"Content-Type": "application/json",
											"RequestVerificationToken": verificationToken
										},
										error: function (err) {
											logRequest("UpdateFriend AJAX FAIL", this, err);
											logError("Your friend " + item.Name + " could not be removed.", err);

											if (source.length > 0) {
												if (isFriendRequestLoop) {
													$('#nt-raf-progress-current').text(source.length);
												} else {
													$('#nt-daf-progress-current').text(source.length);
												}

												RemoveFriend(source);
											} else {
												if (isFriendRequestLoop) {
													swal(
														getTimedSwalArgs(
															"success",
															"Friend requests rejected",
															"<p>All friend requests you received should have been rejected.</p><p>You can see exactly which friends have been removed and which ones haven't by opening the console (F12). To view the changes to your friends list, please refresh the page.</p>"
														)
													);
												} else {
													swal(
														getTimedSwalArgs(
															"success",
															"Friends removed",
															"<p>All your friends should have been removed.</p><p>You can see exactly which friends have been removed and which ones haven't by opening the console (F12). To view the changes to your friends list, please refresh the page.</p>"
														)
													);
												}
											}
										},
										success: function (data) {
											logRequest("UpdateFriend AJAX OK", this, data);

											if (data.Status == true) {
												logGeneric("Your friend " + item.Name + " has been removed.");
											} else {
												logError("Your friend " + item.Name + " could not be removed.", "data.Status != true");
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
													swal(
														getTimedSwalArgs(
															"success",
															"Friend requests rejected",
															"<p>All friend requests you received should have been rejected.</p><p>You can see exactly which friends have been removed and which ones haven't by opening the console (F12). To view the changes to your friends list, please refresh the page.</p>"
														)
													);
												} else {
													swal(
														getTimedSwalArgs(
															"success",
															"Friends removed",
															"<p>All your friends should have been removed.</p><p>You can see exactly which friends have been removed and which ones haven't by opening the console (F12). To view the changes to your friends list, please refresh the page.</p>"
														)
													);
												}
											}
										},
										xhr: function () {
											var xhr = jQuery.ajaxSettings.xhr();
											var setRequestHeader = xhr.setRequestHeader;
											
											xhr.setRequestHeader = function (name, value) {
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
										error: function (err) {
											logRequest("UpdateFriend AJAX FAIL", this, err);
											logError("The friend request you sent to " + item.Name + " could not be cancelled.", err);

											if (source.length > 0) {
												if (isFriendRequestLoop) {
													$('#nt-raf-progress-current').text(source.length);
												} else {
													$('#nt-daf-progress-current').text(source.length);
												}

												RemoveFriend(source);
											} else {
												if (isFriendRequestLoop) {
													swal(
														getTimedSwalArgs(
															"success",
															"Friend requests rejected",
															"<p>All friend requests you received should have been rejected.</p><p>You can see exactly which friends have been removed and which ones haven't by opening the console (F12). To view the changes to your friends list, please refresh the page.</p>"
														)
													);
												} else {
													swal(
														getTimedSwalArgs(
															"success",
															"Friends removed",
															"<p>All your friends should have been removed.</p><p>You can see exactly which friends have been removed and which ones haven't by opening the console (F12). To view the changes to your friends list, please refresh the page.</p>"
														)
													);
												}
											}
										},
										success: function (data) {
											logRequest("UpdateFriend AJAX OK", this, data);

											if (data.Status == true) {
												logGeneric("The friend request you sent to " + item.Name + " has been cancelled.");
											} else {
												logError("The friend request you sent to " + item.Name + " could not be cancelled.", "data.Status != true");
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
													swal(
														getTimedSwalArgs(
															"success",
															"Friend requests rejected",
															"<p>All friend requests you received should have been rejected.</p><p>You can see exactly which friends have been removed and which ones haven't by opening the console (F12). To view the changes to your friends list, please refresh the page.</p>"
														)
													);
												} else {
													swal(
														getTimedSwalArgs(
															"success",
															"Friends removed",
															"<p>All your friends should have been removed.</p><p>You can see exactly which friends have been removed and which ones haven't by opening the console (F12). To view the changes to your friends list, please refresh the page.</p>"
														)
													);
												}
											}
										},
										xhr: function () {
											var xhr = jQuery.ajaxSettings.xhr();
											var setRequestHeader = xhr.setRequestHeader;
											
											xhr.setRequestHeader = function (name, value) {
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
										error: function (err) {
											logRequest("UpdateFriend AJAX FAIL", this, err);
											logError("The friend request you received from " + item.Name + " could not be rejected.", err);

											if (source.length > 0) {
												if (isFriendRequestLoop) {
													$('#nt-raf-progress-current').text(source.length);
												} else {
													$('#nt-daf-progress-current').text(source.length);
												}

												RemoveFriend(source);
											} else {
												if (isFriendRequestLoop) {
													swal(
														getTimedSwalArgs(
															"success",
															"Friend requests rejected",
															"<p>All friend requests you received should have been rejected.</p><p>You can see exactly which friends have been removed and which ones haven't by opening the console (F12). To view the changes to your friends list, please refresh the page.</p>"
														)
													);
												} else {
													swal(
														getTimedSwalArgs(
															"success",
															"Friends removed",
															"<p>All your friends should have been removed.</p><p>You can see exactly which friends have been removed and which ones haven't by opening the console (F12). To view the changes to your friends list, please refresh the page.</p>"
														)
													);
												}
											}
										},
										success: function (data) {
											logRequest("UpdateFriend AJAX OK", this, data);

											if (data.Status == true) {
												logGeneric("The friend request you received from " + item.Name + " has been rejected.");
											} else {
												logError("The friend request you received from " + item.Name + " could not be rejected.", "data.Status != true");
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
													swal(
														getTimedSwalArgs(
															"success",
															"Friend requests rejected",
															"<p>All friend requests you received should have been rejected.</p><p>You can see exactly which friends have been removed and which ones haven't by opening the console (F12). To view the changes to your friends list, please refresh the page.</p>"
														)
													);
												} else {
													swal(
														getTimedSwalArgs(
															"success",
															"Friends removed",
															"<p>All your friends should have been removed.</p><p>You can see exactly which friends have been removed and which ones haven't by opening the console (F12). To view the changes to your friends list, please refresh the page.</p>"
														)
													);
												}
											}
										},
										xhr: function () {
											var xhr = jQuery.ajaxSettings.xhr();
											var setRequestHeader = xhr.setRequestHeader;
											
											xhr.setRequestHeader = function (name, value) {
												if (name == 'X-Requested-With') return;
												setRequestHeader.call(this, name, value);
											}

											return xhr;
										}
									});
								} else {
									logError("The user " + item.Name + " has been skipped.", "type \""+item.Relationship+"\" not supported");

									if (source.length > 0) {
										if (isFriendRequestLoop) {
											$('#nt-raf-progress-current').text(source.length);
										} else {
											$('#nt-daf-progress-current').text(source.length);
										}

										RemoveFriend(source);
									} else {
										if (isFriendRequestLoop) {
											swal(
												getTimedSwalArgs(
													"success",
													"Friend requests rejected",
													"<p>All friend requests you received should have been rejected.</p><p>You can see exactly which friends have been removed and which ones haven't by opening the console (F12). To view the changes to your friends list, please refresh the page.</p>"
												)
											);
										} else {
											swal(
												getTimedSwalArgs(
													"success",
													"Friends removed",
													"<p>All your friends should have been removed.</p><p>You can see exactly which friends have been removed and which ones haven't by opening the console (F12). To view the changes to your friends list, please refresh the page.</p>"
												)
											);
										}
									}
								}
							}, 1000)
						} catch (err) {
							logError("RemoveFriend FAIL", err);
							return;
						}
					}

					function RetrieveBlockedList(source) {
						try {
							var target = [];

							setTimeout(function () {
								$.ajax({
									url: APP_LINK_SC + "/friends/GetBlockedJson",
									headers: {
										"Accept": "application/json",
										"RequestVerificationToken": verificationToken
									},
									error: function (err) {
										logRequest("GetBlockedJson AJAX FAIL", this, err);

										swal(
											getTimedSwalArgs(
												"error",
												err.status + " - " + err.statusText,
												"Something went wrong while trying to retrieve blocked users."
											)
										);
									},
									success: function (data) {
										logRequest("GetBlockedJson AJAX OK", this, data);

										if (data.Status == true) {
											data.RockstarAccounts.forEach(function (e) {
												if (e !== undefined) target.push(e);
											});

											var obj = target.filter(function (obj) {
												return obj.Name.trim().toLowerCase() === source.Nickname.trim().toLowerCase();
											})[0];

											if (obj == undefined) {
												AddFriend(source);
											} else {
												swal(
													getTimedSwalArgs(
														"error",
														"User blocked",
														"<strong>" + source.Nickname + "</strong> is on your blocked users list. To be able to send them a friend request, remove them from your blocked users list, then try again."
													)
												);
											}
										} else {
											swal(
												getTimedSwalArgs(
													"error",
													"Something went wrong",
													"Something went wrong while trying to retrieve blocked users."
												)
											);
										}
									}
								});
							}, 1000)
						} catch (err) {
							logError("RetrieveBlockedList FAIL", err);
							return;
						}
					}

					function AddFriend(source) {
						try {
							$.ajax({
								url: APP_LINK_SC + "/friends/UpdateFriend",
								type: "PUT",
								data: '{"id":'+source.RockstarId+',"op":"addfriend","custommessage":"'+friendMessage+'"}',
								headers: {
									"Content-Type": "application/json",
									"RequestVerificationToken": verificationToken
								},
								error: function (err) {
									logRequest("UpdateFriend AJAX FAIL", this, err);

									swal(
										getTimedSwalArgs(
											"error",
											err.status + " - " + err.statusText,
											"Something went wrong trying to add <strong>" + source.Nickname + "</strong>."
										)
									);
								},
								success: function (data) {
									logRequest("UpdateFriend AJAX OK", this, data);

									if (data.Status == true) {
										swal(
											getTimedSwalArgs(
												"success",
												"User added",
												"<p>A friend request has been sent to <strong>" + source.Nickname + "</strong>.</p><p>To view the changes to your friends list, please refresh the page.</p>",
											)
										);
									} else {
										swal(
											getTimedSwalArgs(
												"error",
												"Something went wrong",
												"Something went wrong trying to add <strong>" + source.Nickname + "</strong>."
											)
										);
									}
								},
								xhr: function () {
									var xhr = jQuery.ajaxSettings.xhr();
									var setRequestHeader = xhr.setRequestHeader;
									
									xhr.setRequestHeader = function (name, value) {
										if (name == 'X-Requested-With') return;
										setRequestHeader.call(this, name, value);
									}

									return xhr;
								}
							});
						} catch (err) {
							logError("AddFriend FAIL", err);
							return;
						}
					}

					$.getJSON(APP_LINK_VERSIONS, function (json) {
						logRequest("Update getJSON OK", this, json);
					})
					.success(function (json) {
						if (json.version != APP_VERSION && json.released) {
							swal(
								getPersistentSwalArgs(
									"warning",
									"Update available!",
									"<p>"+APP_NAME+" <strong>v"+json.version+"</strong> is now available!</p><p>It was released on "+json.date+" and contains the following changes:</p><ul><li>"+json.changes.replace('|', ';</li><li>')+"</li></ul><p>Update your bookmark to the following:</p><textarea id=\"nt-update\" readonly=\"readonly\">javascript:(function () {if(!document.getElementById(\"nt-mtjs\")) {var mtjs=document.createElement(\"script\");mtjs.id=\"nt-mtjs\",mtjs.src=\""+json.link+"\",document.getElementsByTagName(\"head\")[0].appendChild(mtjs)}setTimeout(function () {try{Init(\""+friendMessage+"\","+checkBlocked+")}}catch(err) {alert(\""+APP_NAME+" loading failed: Please try clicking your bookmark again.\")},1e3);})();</textarea>"
								)
							);
						} else {
							swal(
								getTimedSwalArgs(
									"success",
									"Loaded",
									APP_NAME + " was loaded successfully!"
								)
							);
						}
					})
					.error(function (err) {
						logRequest("Update getJSON FAIL", this, err);

						swal(
							getTimedSwalArgs(
								"success",
								"Loaded",
								APP_NAME + " was loaded successfully!"
							)
						);
					});

					try {
						console.log.apply(console, ["%c " + APP_NAME + " %cv" + APP_VERSION + " by " + APP_AUTHOR + " %c " + APP_LINK, "background: #000000;color: #f90", "background: #000000;color: #ffffff", ""]);
					} catch (err) {
						console.log(APP_NAME + " v" + APP_VERSION + " by " + APP_AUTHOR + " - " + APP_LINK);
					}

				} else {
					logError("Log-in required.", "userNickname == \"\" || isLoggedIn");

					swal(
						getPersistentSwalArgs(
							"error",
							"Log in required",
							APP_NAME + " requires you to log in to be able to apply changes to your account. Please log into the account you want to use with "+APP_NAME+", then click the bookmark again."
						)
					);
				}
			} catch (err) {
				if (err instanceof DOMException) {
					logError("Load FAIL", err);

					swal(
						getPersistentSwalArgs(
							"error",
							"Load unsuccessful",
							APP_NAME + " was not loaded correctly. Please try clicking the bookmark again without refreshing the page."
						)
					);
				} else {
					logError("General FAIL", err);

					swal(
						getPersistentSwalArgs(
							"error",
							"An error occured",
							APP_NAME + " was unable to complete your request. Please try clicking the bookmark again. If the problem persists, please <a href=\""+APP_LINK_ISSUEs + "\" target=\"_blank\">submit an issue</a>."
						)
					);
				}
				return;
			}
		} else {
			logError("Wrong website.", "!window.location.href.startsWith("+APP_LINK_SC+")");

			swal(
				{
					type: "warning",
					title: "Wrong site",
					html: true,
					text: "<p>Whoops, you accidentally activated "+APP_NAME+" on a wrong web page. To use "+APP_NAME+", first browse to the Social Club website, then click the bookmark again.</p><p>Do you want to go to the Social Club website now?</p>",

					allowOutsideClick: true,
					cancelButtonText: "No",
					closeOnConfirm: false,
					confirmButtonText: "Yes",
					showCancelButton: true
				},
				function () {
					window.location.href = APP_LINK_SC;
				}
			);
		}
	}, 1000);
}
