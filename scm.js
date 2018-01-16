function Init(friendMessage, checkBlocked) {
	const APP_VERSION = 18;
	const APP_NAME = "Social Club Utility Tool";
	const APP_NAME_SHORT = "SCUT";
	const APP_AUTHOR = "Senex";
	const APP_LINK = "https://github.com/Senexis/Social-Club-Tool";
	const APP_LINK_ISSUES = "https://github.com/Senexis/Social-Club-Tool/issues/new";
	const APP_LINK_VERSIONS = "https://raw.githubusercontent.com/Senexis/Social-Club-Tool/master/v.json?callback";
	const APP_LINK_SC = "https://" + window.location.host;

	try {
		console.log.apply(console, ["%c " + APP_NAME + " %cv" + APP_VERSION + " by " + APP_AUTHOR + " %c " + APP_LINK, "background:#000000;color:#f90", "background:#000000;color:#ffffff", ""]);
	} catch (err) {
		console.log(APP_NAME + " v" + APP_VERSION + " by " + APP_AUTHOR + " - " + APP_LINK);
	}

	if (friendMessage === undefined) friendMessage = "";
	friendMessage = friendMessage.replace(/\\\"/g, '').replace(/\"/g, '').replace(/\s\s+/g, ' ').trim();

	if (checkBlocked === undefined) checkBlocked = 1;

	function logInfo(title, body) {
		console.groupCollapsed("[" + APP_NAME_SHORT + ": INFO] " + title);
		console.log(body);
		console.groupEnd();
	}

	function logError(title, body) {
		console.groupCollapsed("[" + APP_NAME_SHORT + ": ERROR] " + title);
		console.error(body);
		console.groupEnd();
	}

	function logRequest(title, request, response) {
		console.groupCollapsed("[" + APP_NAME_SHORT + ": AJAX] " + title);
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

	function getTimedSwalArgs(type, title, body, timer) {
		if (timer === undefined) timer = 5000;

		return {
			type: type,
			title: title,
			text: body,

			allowOutsideClick: true,
			html: true,
			timer: timer
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
		logError("Something went wrong while trying to load the necessary scripts.", err);
		return;
	}

	setTimeout(function () {
		try {
			$.getJSON(APP_LINK_VERSIONS, function (json) {
				logRequest("Successfully fetched v.json in the update checker.", this, json);
			})
			.success(function (json) {
				if (json.released && json.version > APP_VERSION) {
					swal(
						getPersistentSwalArgs(
							"warning",
							"Update available!",
							"<p>" + APP_NAME + " <strong>v" + json.version + "</strong> is now available!</p><p>It was released on " + json.date + " and contains the following changes:</p><ul><li>" + json.changes.replace(/\|/g, "</li><li>") + "</li></ul><p>Update your bookmark to the following:</p><textarea id=\"nt-update\" readonly=\"readonly\">javascript:(function(){if(!document.getElementById(\"nt-mtjs\")){var t=document.createElement(\"script\");t.id=\"nt-mtjs\",t.src=\"" + json.link + "\",document.getElementsByTagName(\"head\")[0].appendChild(t)}setTimeout(function(){try{Init(\"" + friendMessage + "\"," + checkBlocked + ")}catch(t){alert(\"" + APP_NAME + " loading failed: Please try clicking your bookmark again.\")}},1e3)})();</textarea>"
						)
					);
				} else if (!json.released) {
					logInfo("An update for " + APP_NAME + " was found but it wasn't released yet.", undefined);
				} else {
					logInfo("You are using the latest version of " + APP_NAME + "!", undefined);
				}
			})
			.error(function (err) {
				logRequest("Couldn't fetch v.json in the update checker.", this, err);
			});
		} catch (err) {
			if (err instanceof DOMException) {
				logError("The jQuery library did not successfully load.", err);

				swal(
					getPersistentSwalArgs(
						"error",
						"Load unsuccessful",
						APP_NAME + " did not load correctly. Please try clicking the bookmark again without refreshing the page."
					)
				);
			} else {
				logError("Couldn't run the update checker because something went wrong.", err);
			}
		}

		if (window.location.protocol === "https:" && window.location.host.endsWith("socialclub.rockstargames.com")) {
			try {
				try {
					var verificationToken = $(siteMaster.aft)[0].value;
					var userNickname = siteMaster.authUserNickName;
					var isLoggedIn = siteMaster.isLoggedIn;
				} catch (err) {
					logError("Could not fetch all necessary account data because something went wrong.", err);

					swal(
						getPersistentSwalArgs(
							"error",
							"An error occured",
							"<p style=\"margin:12px 0!important\">" + APP_NAME + " was unable to retrieve the required account data. Please try clicking the bookmark again. If the problem persists, please <a href=\"" + APP_LINK_ISSUES + "\" target=\"_blank\">submit an issue</a> with the details below.</p><p style=\"margin:12px 0!important\">Error:</p><pre>" + err + "</pre>"
						)
					);

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
					$('<li id="nt-cred"> // <a href="' + APP_LINK + '" target="_blank"><span style="color:#f90">' + APP_NAME + '</span> v' + APP_VERSION + ' by ' + APP_AUTHOR + '</a> // </li>').appendTo('#footerNav');

					// Data utility functions.
					function DoGetRequest(object) {
						$.ajax({
							url: object.url,
							error: object.error,
							success: object.success,
							type: "GET",
							headers: {
								"Content-Type": "application/json",
								"RequestVerificationToken": verificationToken
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
					}

					function DoDataRequest(object) {
						$.ajax({
							url: object.url,
							data: JSON.stringify(object.data),
							error: object.error,
							success: object.success,
							complete: object.complete,
							type: object.type,
							headers: {
								"Content-Type": "application/json",
								"RequestVerificationToken": verificationToken
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
					}

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
										DoGetRequest({
											url: APP_LINK_SC + "/Message/GetMessageCount",
											error: function (err) {
												logRequest("Couldn't fetch the total message count in #nt-dam_click.", this, err);

												swal(
													getTimedSwalArgs(
														"error",
														err.status + " - " + err.statusText,
														"Something went wrong while trying to fetch the total amount of messages."
													)
												);
											},
											success: function (data) {
												logRequest("Successfully fetched the total message count in #nt-dam_click.", this, data);

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
							logError("Something went wrong in #nt-dam_click.", err);
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

										DoGetRequest({
											url: APP_LINK_SC + "/friends/GetReceivedInvitesJson",
											error: function (err) {
												logRequest("Couldn't fetch the total received invites count in #nt-raf_click.", this, err);

												swal(
													getTimedSwalArgs(
														"error",
														err.status + " - " + err.statusText,
														"Something went wrong while trying to fetch the total amount of friend requests."
													)
												);
											},
											success: function (data) {
												logRequest("Successfully fetched the total received invites count in #nt-raf_click.", this, data);

												if (data.Status == true && data.TotalCount > 0) {
													$('#nt-raf-progress-current').text(data.TotalCount);
													$('#nt-raf-progress-total').text(data.TotalCount);
													$('#nt-raf-progress').show();

													data.RockstarAccounts.forEach(function (e) {
														children.push(e);
													});

													if (children.length == data.TotalCount) {
														RemoveFriends(children, true);
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
							logError("Something went wrong in #nt-raf_click.", err);
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
										DoGetRequest({
											url: APP_LINK_SC + "/friends/GetFriendsAndInvitesSentJson?pageNumber=0&onlineService=sc&pendingInvitesOnly=false",
											error: function (err) {
												logRequest("Couldn't fetch the friends and invites sent list in #nt-daf_click.", this, err);

												swal(
													getTimedSwalArgs(
														"error",
														err.status + " - " + err.statusText,
														"Something went wrong while trying to fetch the total amount of friends."
													)
												);
											},
											success: function (data) {
												logRequest("Successfully fetched the friends and invites sent list in #nt-daf_click.", this, data);

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
							logError("Something went wrong in #nt-daf_click.", err);
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
								text: '<p>Please enter the Social Club username you want to add. When you click "Add", the user will automatically be added if it exists.</p>' + (checkBlocked ? "" : "<p><strong>Note:</strong> You have disabled the blocked users list check. If the user is on your blocked users list, they will be unblocked and sent a friend request.</p>") + (friendMessage == "" ? "" : "<p><strong>Note:</strong> You have set a custom friend request message, which will get sent to the user.</p>"),

								allowEscapeKey: false,
								closeOnConfirm: false,
								confirmButtonText: "Add",
								html: true,
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

								DoGetRequest({
									url: APP_LINK_SC + "/Friends/GetAccountDetails?nickname=" + inputValue + "&full=false",
									error: function (err) {
										logRequest("Couldn't fetch the account details of " + inputValue + " in #nt-qa_click.", this, err);

										swal(
											getTimedSwalArgs(
												"error",
												err.status + " - " + err.statusText,
												"Something went wrong while trying to check whether <strong>" + inputValue + "</strong> exists or not."
											)
										);
									},
									success: function (data) {
										logRequest("Successfully fetched the account details of " + inputValue + " in #nt-qa_click.", this, data);

										if (data.Status == true) {
											if (data.Relation == "Friend") {
												swal(
													getTimedSwalArgs(
														"success",
														"Already added",
														"<strong>" + inputValue + "</strong> is already your friend."
													)
												);
											} else {
												if (data.AllowAddFriend == true) {
													if (checkBlocked) {
														RetrieveBlockedList(data);
													} else {
														AddFriend(data);
													}
												} else {
													if (data.AllowAcceptFriend == true) {
														AcceptFriend(data);
													} else {
														swal(
															getTimedSwalArgs(
																"error",
																"Can't send request",
																"You can't send <strong>" + inputValue + "</strong> a friend request. This might be because you already sent them a friend request, or because they blocked you."
															)
														);
													}
												}
											}
										} else {
											swal(
												getTimedSwalArgs(
													"error",
													"User not found",
													"The nickname <strong>" + inputValue + "</strong> doesn't exist."
												)
											);
										}
									}
								});
							});
						} catch (err) {
							logError("Something went wrong in #nt-qa_click.", err);
							return false;
						}

						return false;
					});

					// Utility functions.
					function RetrieveAllMessageUsers(source, pageIndex) {
						try {
							if (pageIndex === undefined) pageIndex = 0;

							setTimeout(function () {
								DoGetRequest({
									url: APP_LINK_SC + "/Message/GetConversationList?pageIndex=" + pageIndex,
									error: function (err) {
										logRequest("Couldn't fetch the conversation list in RetrieveAllMessageUsers().", this, err);

										swal(
											getTimedSwalArgs(
												"error",
												err.status + " - " + err.statusText,
												"Something went wrong while trying to fetch the conversation list."
											)
										);
									},
									success: function (data) {
										logRequest("Successfully fetched the conversation list in RetrieveAllMessageUsers().", this, data);

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
							logError("Something went wrong in RetrieveAllMessageUsers().", err);
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

								logInfo("Popped the items list in RetrieveAllMessages().", item);

								DoGetRequest({
									url: APP_LINK_SC + "/Message/GetMessages?rockstarId=" + item.RockstarId,
									error: function (err) {
										logRequest("Couldn't fetch the messages list in RetrieveAllMessages().", this, err);

										if (source.length > 0) {
											RetrieveAllMessages(source, target);
										} else if (target.length > 0) {
											$('#nt-dam-retrieving').hide();
											$('#nt-dam-progress').show();
											RemoveMessages(target);
										}
									},
									success: function (data) {
										logRequest("Successfully fetched the messages list in RetrieveAllMessages().", this, data);

										target = target.concat(data.Messages);

										if (source.length > 0) {
											RetrieveAllMessages(source, target);
										} else if (target.length > 0) {
											$('#nt-dam-retrieving').hide();
											$('#nt-dam-progress').show();
											RemoveMessages(target);
										}
									}
								});
							}, 1000)
						} catch (err) {
							logError("Something went wrong in RetrieveAllMessages().", err);
							return;
						}
					}

					function RemoveMessages(source, hasError) {
						try {
							if (hasError === undefined) hasError = false;

							setTimeout(function () {
								var CompleteFunction = function () {
									$('#nt-dam-progress-current').text(source.length);

									if (source.length > 0) {
										RemoveMessages(source, hasError);
										return;
									}

									var status = !hasError ? "success" : "warning";
									var timer = !hasError ? 5000 : 60000;

									swal(
										getTimedSwalArgs(
											status,
											"Messages removed",
											(hasError ? "<p>One or more messages could not be deleted due to an error. Please try again or remove them manually.</p>" : "<p>All messages in your inbox have been deleted.</p>") + "<p>To view the changes to your inbox, please refresh the page.</p>",
											timer
										)
									);
								}

								var item = source.pop();
								if (item === undefined) {
									logError("An item has been skipped.", "The current item is undefined, also I'm a teapot.");
									CompleteFunction();
									return;
								}

								logInfo("Popped the items list in RemoveMessages().", item);

								DoDataRequest({
									url: APP_LINK_SC + "/Message/DeleteMessage",
									type: "POST",
									data: {
										"messageid": item.ID,
										"isAdmin": item.IsAdminMessage
									},
									error: function (err) {
										logRequest("Couldn't complete delete message " + item.ID + " in RemoveMessages().", this, err);

										hasError = true;
									},
									success: function (data) {
										logRequest("Successfully completed deleted message " + item.ID + " in RemoveMessages().", this, data);

										if (data.Status != true) {
											hasError = true;
										}
									},
									complete: CompleteFunction
								});
							}, 1000)
						} catch (err) {
							logError("Something went wrong in RemoveMessages().", err);
							return;
						}
					}

					function RetrieveAllFriends(source, pageIndex) {
						try {
							if (pageIndex === undefined) pageIndex = 0;

							setTimeout(function () {
								DoGetRequest({
									url: APP_LINK_SC + "/friends/GetFriendsAndInvitesSentJson?pageNumber=" + pageIndex + "&onlineService=sc&pendingInvitesOnly=false",
									error: function (err) {
										logRequest("Couldn't fetch the friends and invites sent list in RetrieveAllFriends().", this, err);

										swal(
											getTimedSwalArgs(
												"error",
												err.status + " - " + err.statusText,
												"Something went wrong while trying to fetch data from page " + pageIndex + "."
											)
										);
									},
									success: function (data) {
										logRequest("Successfully fetched the friends and invites sent list in RetrieveAllFriends().", this, data);

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
											RemoveFriends(source);
										}
									}
								});
							}, 1000)
						} catch (err) {
							logError("Something went wrong in RetrieveAllFriends().", err);
							return;
						}
					}

					function RemoveFriends(source, isFriendRequestLoop, errorObjects) {
						try {
							if (isFriendRequestLoop === undefined) isFriendRequestLoop = false;
							if (errorObjects === undefined) errorObjects = [];

							setTimeout(function () {
								var operation = undefined;
								var CompleteFunction = function () {
									$('#nt-daf-progress-current, #nt-raf-progress-current').text(source.length);

									if (source.length > 0) {
										RemoveFriends(source, isFriendRequestLoop, errorObjects);
										return;
									}

									var status = errorObjects.length === 0 ? "success" : "warning";
									var timer = errorObjects.length === 0 ? 5000 : 60000;
									var errorObjectsString = errorObjects.reduce(function (prev, curr, i) { return prev + curr + ( ( i === errorObjects.length - 2 ) ? ' and ' : ', ' ) }, '').slice(0, -2);

									if (isFriendRequestLoop) {
										swal(
											getTimedSwalArgs(
												status,
												"Friend requests rejected",
												(errorObjects.length !== 0 ? "<p>" + errorObjectsString + " could not be rejected due to an error. Please try again or remove them manually.</p>" : "<p>All friend requests you received have been rejected.</p>") + "<p>To view the changes to your friends list, please refresh the page.</p>",
												timer
											)
										);
									} else {
										swal(
											getTimedSwalArgs(
												status,
												"Friends removed",
												(errorObjects.length !== 0 ? "<p>" + errorObjectsString + " could not be deleted due to an error. Please try again or remove them manually.</p>" : "<p>All friends have been deleted.</p>") + "<p>To view the changes to your friends list, please refresh the page.</p>",
												timer
											)
										);
									}
								}

								var item = source.pop();
								if (item === undefined) {
									logError("An item has been skipped.", "The current item is undefined, also I'm a teapot.");
									CompleteFunction();
									return;
								}

								logInfo("Popped the items list in RemoveFriends().", item);

								if (item.AllowDelete === true) {
									operation = "delete";
								} else if (item.AllowCancel === true) {
									operation = "cancel";
								} else if (item.AllowAdd === true) {
									operation = "ignore";
								} else {
									logError("An item has been skipped.", "No operation is possible for " + item.Name + ".");

									errorObjects.push(item.Name);
									CompleteFunction();
									return;
								}

								DoDataRequest({
									url: APP_LINK_SC + "/friends/UpdateFriend",
									type: "PUT",
									data: {
										"id": item.RockstarId,
										"op": operation
									},
									error: function (err) {
										logRequest("Couldn't complete " + operation + " " + item.Name + " in RemoveFriends().", this, err);

										errorObjects.push(item.Name);
									},
									success: function (data) {
										logRequest("Successfully completed " + operation + " " + item.Name + " in RemoveFriends().", this, data);

										if (data.Status != true) {
											errorObjects.push(item.Name);
										}
									},
									complete: CompleteFunction
								});
							}, 1000)
						} catch (err) {
							logError("Something went wrong in RemoveFriends().", err);
							return;
						}
					}

					function RetrieveBlockedList(source) {
						try {
							var target = [];

							setTimeout(function () {
								DoGetRequest({
									url: APP_LINK_SC + "/friends/GetBlockedJson",
									error: function (err) {
										logRequest("Couldn't fetch blocked users list in RetrieveBlockedList().", this, err);

										swal(
											getTimedSwalArgs(
												"error",
												err.status + " - " + err.statusText,
												"Something went wrong while trying to retrieve blocked users."
											)
										);
									},
									success: function (data) {
										logRequest("Successfully fetched blocked users list in RetrieveBlockedList().", this, data);

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
							logError("Something went wrong in RetrieveBlockedList().", err);
							return;
						}
					}

					function AddFriend(source) {
						try {
							DoDataRequest({
								url: APP_LINK_SC + "/friends/UpdateFriend",
								type: "PUT",
								data: {
									"id": source.RockstarId,
									"op": "addfriend",
									"custommessage": friendMessage
								},
								error: function (err) {
									logRequest("Couldn't complete add " + source.Nickname + " in AddFriend().", this, err);

									swal(
										getTimedSwalArgs(
											"error",
											err.status + " - " + err.statusText,
											"Something went wrong trying to add <strong>" + source.Nickname + "</strong>."
										)
									);
								},
								success: function (data) {
									logRequest("Successfully completed add " + source.Nickname + " in AddFriend().", this, data);

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
								}
							});
						} catch (err) {
							logError("Something went wrong in AddFriend().", err);
							return;
						}
					}

					function AcceptFriend(source) {
						try {
							DoDataRequest({
								url: APP_LINK_SC + "/friends/UpdateFriend",
								type: "PUT",
								data: {
									"id": source.RockstarId,
									"op": "confirm",
									"accept": "true"
								},
								error: function (err) {
									logRequest("Couldn't complete accept " + source.Nickname + "'s friend request in AcceptFriend().", this, err);

									swal(
										getTimedSwalArgs(
											"error",
											err.status + " - " + err.statusText,
											"Something went wrong trying to accept <strong>" + source.Nickname + "</strong>'s friend request."
										)
									);
								},
								success: function (data) {
									logRequest("Successfully completed accept " + source.Nickname + "'s friend request in AcceptFriend().", this, data);

									if (data.Status == true) {
										swal(
											getTimedSwalArgs(
												"success",
												"User accepted",
												"<p><strong>" + source.Nickname + "</strong> already sent you a friend request, and we accepted it instead of sending a new one.</p><p>To view the changes to your friends list, please refresh the page.</p>",
											)
										);
									} else {
										swal(
											getTimedSwalArgs(
												"error",
												"Something went wrong",
												"Something went wrong trying to accept <strong>" + source.Nickname + "</strong>'s friend request."
											)
										);
									}
								}
							});
						} catch (err) {
							logError("Something went wrong in AcceptFriend().", err);
							return;
						}
					}
				} else {
					logError("In order to use " + APP_NAME + ", you must log into your Social Club account.", "userNickname == \"\" || isLoggedIn != true");

					swal(
						getPersistentSwalArgs(
							"error",
							"Log in required",
							APP_NAME + " requires you to log in to be able to apply changes to your account. Please log into the account you want to use with " + APP_NAME + ", then click the bookmark again."
						)
					);
				}
			} catch (err) {
				logError("Something went wrong.", err);

				swal(
					getPersistentSwalArgs(
						"error",
						"An error occured",
						"<p style=\"margin:12px 0!important\">" + APP_NAME + " was unable to complete your request. Please try clicking the bookmark again. If the problem persists, please <a href=\"" + APP_LINK_ISSUES + "\" target=\"_blank\">submit an issue</a> with the details below.</p><p style=\"margin:12px 0!important\">Error:</p><pre>" + err + "</pre>"
					)
				);

				return;
			}
		} else {
			logError("The current website is not a Social Club website and " + APP_NAME + " can't continue.", "window.location.protocol !== \"https:\" || !window.location.host.endsWith(\"socialclub.rockstargames.com\")");

			swal(
				{
					type: "warning",
					title: "Wrong site",
					text: "<p>Whoops, you accidentally activated " + APP_NAME + " on a wrong web page. To use " + APP_NAME + ", first browse to the Social Club website, then click the bookmark again.</p><p>Do you want to go to the Social Club website now?</p>",

					allowOutsideClick: true,
					cancelButtonText: "No",
					closeOnConfirm: false,
					confirmButtonText: "Yes",
					html: true,
					showCancelButton: true
				},
				function () {
					window.location.href = "http://socialclub.rockstargames.com/";
				}
			);
		}
	}, 1000);
}
