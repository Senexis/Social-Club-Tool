function Init(friendMessage, checkBlocked, debug) {
	const APP_VERSION = 28;
	const APP_NAME = "Social Club Utility Tool";
	const APP_NAME_SHORT = "SCUT";
	const APP_AUTHOR = "Senex";
	const APP_LINK = "https://github.com/Senexis/Social-Club-Tool";
	const APP_LINK_ISSUES = "https://github.com/Senexis/Social-Club-Tool/issues/new";
	const APP_LINK_SC = "https://" + window.location.host;
	const APP_CLIENT_VERSION = localStorage.getItem('SCUT_CLIENT_VERSION');
	const APP_REQUEST_DELAY = 1000;

	try {
		console.log.apply(console, ["%c " + APP_NAME + " %cv" + APP_VERSION + " by " + APP_AUTHOR + " %c " + APP_LINK, "background:#000000;color:#f90", "background:#000000;color:#ffffff", ""]);
	} catch (err) {
		console.log(APP_NAME + " v" + APP_VERSION + " by " + APP_AUTHOR + " - " + APP_LINK);
	}

	if (friendMessage === undefined) friendMessage = "";
	friendMessage = friendMessage.replace(/\\\"/g, '').replace(/\"/g, '').replace(/\s\s+/g, ' ').trim();

	if (checkBlocked === undefined) checkBlocked = 1;
	if (debug === undefined) debug = 0;

	if (debug === 1) alert(APP_NAME + " v" + APP_VERSION + " started in debug mode. If you see this and don't want to, remove the last 1 from Init().");

	// Generic helper functions.
	function GetCookie(name) {
		var v = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
		return v ? v[2] : null;
	}

	// UI utility functions.
	function LogInfo(title, body) {
		console.groupCollapsed("[" + APP_NAME_SHORT + ": INFO] " + title);
		console.log(body);
		console.groupEnd();
	}

	function LogError(title, body) {
		console.groupCollapsed("[" + APP_NAME_SHORT + ": ERROR] " + title);
		console.error(body);
		console.groupEnd();
	}

	function LogRequest(title, request, response) {
		console.groupCollapsed("[" + APP_NAME_SHORT + ": AJAX] " + title);
		console.group("Request");
		console.log(request);
		console.groupEnd();
		console.group("Response");
		console.log(response);
		console.groupEnd();
		console.groupEnd();
	}

	function GetYesNoSwalArgs(type, title, body) {
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

	function GetTimedSwalArgs(type, title, body, timer) {
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

	function GetPersistentSwalArgs(type, title, body) {
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
		LogError("Something went wrong while trying to load the necessary scripts.", err);
		return;
	}

	setTimeout(function () {
		if (window.location.protocol === "https:" && window.location.host.endsWith("socialclub.rockstargames.com")) {
			try {
				try {
					var verificationToken = $(siteMaster.aft)[0].value;
					var userNickname = siteMaster.authUserNickName;
					var isLoggedIn = siteMaster.isLoggedIn;
				} catch (err) {
					LogError("Could not fetch all necessary account data because something went wrong.", err);

					swal(
						GetPersistentSwalArgs(
							"error",
							"An error occured",
							"<p style=\"margin:12px 0!important\">" + APP_NAME + " was unable to retrieve the required account data. Please try clicking the bookmark again. If the problem persists, please <a href=\"" + APP_LINK_ISSUES + "\" target=\"_blank\">submit an issue</a> with the details below.</p><p style=\"margin:12px 0!important\">Error:</p><pre>" + err + "</pre>"
						)
					);

					return;
				}

				if (userNickname != "" && isLoggedIn) {
					// Insert custom styling.
					$('<style>body{margin-bottom:99px}#nt-root{z-index:999;position:fixed;bottom:0;left:0;right:0;text-align:center;background-color:rgba(0,0,0,.9);padding:.5rem}#nt-cred{color:white;border-top:solid 1px #333;padding:.5rem 0;margin-top:.5rem}#nt-cred a{color:white}#nt-update{padding:.5em;width:100%;height:10em;border:2px solid #f90;text-align:center;resize:none;background:0 0;cursor:initial}.sweet-alert button,.sweet-alert button.cancel,.nt-button{background:linear-gradient(90deg,#f7931e,#fcaf17)!important;border-color:#fcaf17!important;border-radius:3px;border-style:solid;border-width:1px;box-shadow:none!important;color:#fff!important;cursor:pointer;display:inline-block!important;font-family:-apple-system,BlinkMacSystemFont,Roboto,Oxygen-Sans,Ubuntu,Cantarell,Helvetica Neue,sans-serif;font-size:1rem;font-weight:700;line-height:2.25rem;padding:0 1.25rem;margin-right:.5rem;text-align:center;text-decoration:none;text-shadow:0 1px 1px rgba(26,26,26,.2);vertical-align:bottom}.sweet-alert button.cancel{background:linear-gradient(90deg,#aaa,#ccc)!important;border-color:#ccc!important}.sweet-alert button:active:not(:disabled),.sweet-alert button:hover:not(:disabled),.nt-button:active:not(:disabled),.nt-button:hover:not(:disabled){background:#fcaf17!important}.sweet-alert button.cancel:active:not(:disabled),.sweet-alert button.cancel:hover:not(:disabled){background:#ccc!important}.sweet-alert{background-color:#333;color:white;box-shadow:0 2px 5px 0 rgba(0,0,0,.5);border-radius:.5rem}.sweet-alert p,.sweet-alert h2{color:white}.sweet-alert p{margin:12px 0!important}.sweet-alert strong{font-weight:700!important}.sweet-alert ul{list-style:outside}.sweet-alert fieldset{display:none}.sweet-alert.show-input fieldset{display:block}.sweet-alert input{background:#333!important;border:solid 3px white;border-radius:.5rem;color:white}.sweet-alert input:focus{outline:0;background:rgba(255,255,255,.1);border:solid 3px white;box-shadow:none!important}.sweet-alert .sa-input-error{top:27px}.sweet-alert .sa-error-container,.sweet-alert .sa-icon.sa-success .sa-fix,.sweet-alert .sa-icon.sa-success::before,.sweet-alert .sa-icon.sa-success::after{background:#333!important}.sweet-alert .sa-icon.sa-success .sa-fix{width:7px;height:92px}.la-ball-fall{color:rgba(255,255,255,.5)!important}</style>').appendTo('head');

					// Remove elements if they exist already.
					if (document.getElementById("nt-root")) $("#nt-root").remove();
					if (document.getElementById("nt-dam")) $("#nt-dam").remove();
					if (document.getElementById("nt-daf")) $("#nt-daf").remove();
					if (document.getElementById("nt-raf")) $("#nt-raf").remove();
					if (document.getElementById("nt-qa")) $("#nt-qa").remove();
					if (document.getElementById("nt-cred")) $("#nt-cred").remove();

					// Add elements to the DOM.
					$('<div id="nt-root"></div>').prependTo('body')
					$('<a id="nt-dam" class="nt-button" href="javascript:void(0)">Delete all messages</a>').appendTo('#nt-root');
					$('<a id="nt-daf" class="nt-button" href="javascript:void(0)">Delete all friends</a>').appendTo('#nt-root');
					$('<a id="nt-raf" class="nt-button" href="javascript:void(0)">Reject all friend requests</a>').appendTo('#nt-root');
					$('<a id="nt-qa" class="nt-button" href="javascript:void(0)">Quick-add user</a>').appendTo('#nt-root');
					$('<div id="nt-cred"> // <a href="' + APP_LINK + '" target="_blank"><span style="color:#f7931e">' + APP_NAME + '</span> by ' + APP_AUTHOR + '</a> // v' + APP_VERSION + ' // </div>').appendTo('#nt-root');

					if (APP_CLIENT_VERSION != APP_VERSION) {
						// Display updated message.
						$('#nt-cred').append('<span style="color:#f7931e">Updated automatically!</span> //')
						localStorage.setItem('SCUT_CLIENT_VERSION', APP_VERSION);
					}

					// Add click listeners to the different elements.
					$("#nt-dam").click(function (e) {
						e.preventDefault();

						try {
							swal(
								GetYesNoSwalArgs(
									"warning",
									"Are you sure?",
									"<p>All messages will be deleted from your inbox.</p><p>This process may take up to several minutes. Please be patient for it to be completed before browsing away from this page.</p><p><strong class=\"nt-swal-retrieving\" style=\"display:none;\">Retrieving <span class=\"nt-swal-retrieving-text\">conversation list</span>...</strong></p><p><strong class=\"nt-swal-progress\" style=\"display:none;\"><span class=\"nt-swal-progress-current\">0</span> of <span class=\"nt-swal-progress-total\">0</span> message(s) remaining...</strong></p>"
								),
								function (isConfirm) {
									if (isConfirm) {
										RemoveMessagesAction();
									} else {
										return false;
									}
								}
							);
						} catch (err) {
							LogError("Something went wrong in #nt-dam_click.", err);
							return false;
						}

						return false;
					});

					$("#nt-raf").click(function (e) {
						e.preventDefault();

						try {
							swal(
								GetYesNoSwalArgs(
									"warning",
									"Are you sure?",
									"<p>All friend requests you have received will be rejected.</p><p>This process may take up to several minutes. Please be patient for it to be completed before browsing away from this page.</p><p><strong class=\"nt-swal-progress\" style=\"display:none;\"><span class=\"nt-swal-progress-current\">0</span> of <span class=\"nt-swal-progress-total\">0</span> friend request(s) remaining...</strong></p>"
								),
								function (isConfirm) {
									if (isConfirm) {
										RemoveFriendRequestsAction();
									} else {
										return false;
									}
								}
							);
						} catch (err) {
							LogError("Something went wrong in #nt-raf_click.", err);
							return false;
						}

						return false;
					});

					$("#nt-daf").click(function (e) {
						e.preventDefault();

						try {
							swal(
								GetYesNoSwalArgs(
									"warning",
									"Are you sure?",
									"<p>All friends will be removed from your friend list.<p></p>This process may take up to several minutes. Please be patient for it to be completed before browsing away from this page.</p><p><strong class=\"nt-swal-retrieving\" style=\"display:none;\">Retrieving friends...</strong></p><p><strong class=\"nt-swal-progress\" style=\"display:none;\"><span class=\"nt-swal-progress-current\">0</span> of <span class=\"nt-swal-progress-total\">0</span> friend(s) remaining...</strong></p>",
								),
								function (isConfirm) {
									if (isConfirm) {
										RemoveFriendsAction();
									} else {
										return false;
									}
								}
							);
						} catch (err) {
							LogError("Something went wrong in #nt-daf_click.", err);
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
							}, (inputValue) => QuickAddAction(inputValue));
						} catch (err) {
							LogError("Something went wrong in #nt-qa_click.", err);
							return false;
						}

						return false;
					});

					// Data utility functions.
					function DoLegacyGetRequest(object) {
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

					function DoLegacyDataRequest(object) {
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

					// Action functions.
					function RemoveMessagesAction() {
						DoLegacyGetRequest({
							url: APP_LINK_SC + "/Message/GetMessageCount",
							error: function (err) {
								LogRequest("Couldn't fetch the total message count in #nt-dam_click.", this, err);

								swal(
									GetTimedSwalArgs(
										"error",
										err.status + " - " + err.statusText,
										"Something went wrong while trying to fetch the total amount of messages."
									)
								);
							},
							success: function (data) {
								LogRequest("Successfully fetched the total message count in #nt-dam_click.", this, data);

								if (data.Total > 0) {
									$('.nt-swal-progress-current').text(data.Total);
									$('.nt-swal-progress-total').text(data.Total);
									$('.nt-swal-retrieving').show()
									RetrieveAllMessageUsers([]);
								} else {
									swal(
										GetTimedSwalArgs(
											"success",
											"No messages",
											"There were no messages to delete."
										)
									);
								}
							}
						});
					}

					function RemoveFriendsAction() {
						var pageIndex = 0;
						var pageSize = 12;

						DoRequest({
							url: `${siteMaster.scApiBase}/friends/getFriendsFiltered?onlineService=sc&nickname=&pageIndex=${pageIndex}&pageSize=${pageSize}`,
							method: 'GET',
							success: function (json) {
								LogRequest("Successfully fetched the friends list in #nt-daf_click.", this, json);

								if (json.status == true && json.rockstarAccountList.total > 0) {
									$('.nt-swal-progress-current').text(json.rockstarAccountList.total);
									$('.nt-swal-progress-total').text(json.rockstarAccountList.total);
									$('.nt-swal-retrieving').show();

									RetrieveRockstarAccounts(`${siteMaster.scApiBase}/friends/getFriendsFiltered`, `${siteMaster.scApiBase}/friends/remove`, function (errorObjects) {
										var hasError = errorObjects.length > 0;
										var status = hasError ? "success" : "warning";
										var title = "Friends removed"
										var body = '';
										var timer = hasError ? 5000 : 60000;

										if (hasError) {
											var errorString = errorObjects.reduce(function (prev, curr, i) { return prev + curr + ((i === errorObjects.length - 2) ? ' and ' : ', ') }, '').slice(0, -2);
											body = "<p>" + errorString + " could not be removed due to an error. Please try again or remove them manually.</p>";
										} else {
											body = "<p>All friends have been removed.</p>";
										}

										body += "<p>To view the changes to your friends list, please refresh the page.</p>";

										swal(GetTimedSwalArgs(status, title, body, timer));
									});
								} else if (json.status == true && json.rockstarAccountList.total == 0) {
									swal(
										GetTimedSwalArgs(
											"success",
											"No friends",
											"There were no friends to remove."
										)
									);
								} else {
									swal(
										GetTimedSwalArgs(
											"error",
											"Something went wrong",
											"Something went wrong while trying to fetch friend data."
										)
									);
								}
							},
							error: function (error) {
								LogRequest("Couldn't fetch the friends list in #nt-daf_click.", this, error);

								swal(
									GetTimedSwalArgs(
										"error",
										error.status + " - " + error.statusText,
										"Something went wrong while trying to fetch the total amount of friends."
									)
								);
							}
						});
					}

					function RemoveFriendRequestsAction() {
						var pageIndex = 0;
						var pageSize = 12;

						DoRequest({
							url: `${siteMaster.scApiBase}/friends/getInvites?onlineService=sc&nickname=&pageIndex=${pageIndex}&pageSize=${pageSize}`,
							method: 'GET',
							success: function (json) {
								LogRequest("Successfully fetched the friend requests in #nt-raf_click.", this, json);

								if (json.status == true && json.rockstarAccountList.total > 0) {
									$('.nt-swal-progress-current').text(json.rockstarAccountList.total);
									$('.nt-swal-progress-total').text(json.rockstarAccountList.total);
									$('.nt-swal-retrieving').show();

									RetrieveRockstarAccounts(`${siteMaster.scApiBase}/friends/getInvites`, `${siteMaster.scApiBase}/friends/cancelInvite`, function (errorObjects) {
										var hasError = errorObjects.length > 0;
										var status = hasError ? "success" : "warning";
										var title = "Friend requests cancelled"
										var body = '';
										var timer = hasError ? 5000 : 60000;

										if (hasError) {
											var errorString = errorObjects.reduce(function (prev, curr, i) { return prev + curr + ((i === errorObjects.length - 2) ? ' and ' : ', ') }, '').slice(0, -2);
											body = "<p>" + errorString + " could not be cancelled due to an error. Please try again or remove them manually.</p>";
										} else {
											body = "<p>All friend requests have been cancelled.</p>";
										}

										body += "<p>To view the changes to your friend requests, please refresh the page.</p>";

										swal(GetTimedSwalArgs(status, title, body, timer));
									});
								} else if (json.status == true && json.rockstarAccountList.total == 0) {
									swal(
										GetTimedSwalArgs(
											"success",
											"No friend requests",
											"There were no friend requests to cancel."
										)
									);
								} else {
									swal(
										GetTimedSwalArgs(
											"error",
											"Something went wrong",
											"Something went wrong while trying to fetch friend data."
										)
									);
								}
							},
							error: function (error) {
								LogRequest("Couldn't fetch the friend requests in #nt-raf_click.", this, error);

								swal(
									GetTimedSwalArgs(
										"error",
										error.status + " - " + error.statusText,
										"Something went wrong while trying to fetch the total amount of friend requests."
									)
								);
							}
						});
					}

					function QuickAddAction(inputValue) {
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

						DoLegacyGetRequest({
							url: APP_LINK_SC + "/Friends/GetAccountDetails?nickname=" + inputValue + "&full=false",
							error: function (err) {
								LogRequest("Couldn't fetch the account details of " + inputValue + " in #nt-qa_click.", this, err);

								swal(
									GetTimedSwalArgs(
										"error",
										err.status + " - " + err.statusText,
										"Something went wrong while trying to check whether <strong>" + inputValue + "</strong> exists or not."
									)
								);
							},
							success: function (data) {
								LogRequest("Successfully fetched the account details of " + inputValue + " in #nt-qa_click.", this, data);

								if (data.Status == true) {
									if (data.Relation == "Friend") {
										swal(
											GetTimedSwalArgs(
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
													GetTimedSwalArgs(
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
										GetTimedSwalArgs(
											"error",
											"User not found",
											"The nickname <strong>" + inputValue + "</strong> doesn't exist."
										)
									);
								}
							}
						});
					}

					// Utility functions.
					function RetrieveAllMessageUsers(source, pageIndex) {
						try {
							if (pageIndex === undefined) pageIndex = 0;

							setTimeout(function () {
								DoLegacyGetRequest({
									url: APP_LINK_SC + "/Message/GetConversationList?pageIndex=" + pageIndex,
									error: function (err) {
										LogRequest("Couldn't fetch the conversation list in RetrieveAllMessageUsers().", this, err);

										swal(
											GetTimedSwalArgs(
												"error",
												err.status + " - " + err.statusText,
												"Something went wrong while trying to fetch the conversation list."
											)
										);
									},
									success: function (data) {
										LogRequest("Successfully fetched the conversation list in RetrieveAllMessageUsers().", this, data);

										data.Users.forEach(function (e) {
											source.push(e);
										});

										if (data.HasMore === true) {
											RetrieveAllMessageUsers(source, data.NextPageIndex);
										} else {
											$('.nt-swal-retrieving-text').text("messages");
											RetrieveAllMessages(source);
										}
									}
								});
							}, APP_REQUEST_DELAY)
						} catch (err) {
							LogError("Something went wrong in RetrieveAllMessageUsers().", err);
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

								LogInfo("Popped the items list in RetrieveAllMessages().", item);

								DoLegacyGetRequest({
									url: APP_LINK_SC + "/Message/GetMessages?rockstarId=" + item.RockstarId,
									error: function (err) {
										LogRequest("Couldn't fetch the messages list in RetrieveAllMessages().", this, err);

										if (source.length > 0) {
											RetrieveAllMessages(source, target);
										} else if (target.length > 0) {
											$('.nt-swal-retrieving').hide();
											$('.nt-swal-progress').show();
											RemoveMessages(target);
										}
									},
									success: function (data) {
										LogRequest("Successfully fetched the messages list in RetrieveAllMessages().", this, data);

										target = target.concat(data.Messages);

										if (source.length > 0) {
											RetrieveAllMessages(source, target);
										} else if (target.length > 0) {
											$('.nt-swal-retrieving').hide();
											$('.nt-swal-progress').show();
											RemoveMessages(target);
										}
									}
								});
							}, APP_REQUEST_DELAY)
						} catch (err) {
							LogError("Something went wrong in RetrieveAllMessages().", err);
							return;
						}
					}

					function RemoveMessages(source, hasError) {
						try {
							if (hasError === undefined) hasError = false;

							var CompleteFunction = function () {
								$('.nt-swal-progress-current').text(source.length);

								setTimeout(function () {
									if (source.length > 0) {
										RemoveMessages(source, hasError);
										return;
									}

									var status = !hasError ? "success" : "warning";
									var timer = !hasError ? 5000 : 60000;

									swal(
										GetTimedSwalArgs(
											status,
											"Messages removed",
											(hasError ? "<p>One or more messages could not be deleted due to an error. Please try again or remove them manually.</p>" : "<p>All messages in your inbox have been deleted.</p>") + "<p>To view the changes to your inbox, please refresh the page.</p>",
											timer
										)
									);
								}, APP_REQUEST_DELAY);
							}

							var item = source.pop();
							if (item === undefined) {
								LogError("An item has been skipped.", "The current item is undefined, also I'm a teapot.");
								CompleteFunction();
								return;
							}

							LogInfo("Popped the items list in RemoveMessages().", item);

							DoLegacyDataRequest({
								url: APP_LINK_SC + "/Message/DeleteMessage",
								type: "POST",
								data: {
									"messageid": item.ID,
									"isAdmin": item.IsAdminMessage
								},
								error: function (err) {
									LogRequest("Couldn't complete delete message " + item.ID + " in RemoveMessages().", this, err);

									hasError = true;
								},
								success: function (data) {
									LogRequest("Successfully completed deleted message " + item.ID + " in RemoveMessages().", this, data);

									if (data.Status != true) {
										hasError = true;
									}
								},
								complete: CompleteFunction
							});
						} catch (err) {
							LogError("Something went wrong in RemoveMessages().", err);
							return;
						}
					}

					function RetrieveRockstarAccounts(retrieveUrl, actionUrl, actionCallback, source, pageIndex, pageSize) {
						try {
							if (retrieveUrl === undefined) throw new Error('No retrieve URL supplied.');
							if (actionUrl === undefined) throw new Error('No action URL supplied.');
							if (actionCallback === undefined) throw new Error('No action callback supplied.');

							if (source === undefined) source = [];
							if (pageIndex === undefined) pageIndex = 0;
							if (pageSize === undefined) pageSize = 12;

							DoRequest({
								url: `${retrieveUrl}?onlineService=sc&nickname=&pageIndex=${pageIndex}&pageSize=${pageSize}`,
								method: 'GET',
								success: function (json) {
									LogRequest("Successfully fetched the friends list in RetrieveRockstarAccounts().", this, json);

									if (json.status == true) {
										json.rockstarAccountList.rockstarAccounts.forEach(function (account) {
											if (account !== undefined) source.push(account);
										});
									} else {
										swal(
											GetTimedSwalArgs(
												"error",
												"Something went wrong",
												"Something went wrong while trying to fetch data from page " + pageIndex + "."
											)
										);
									}

									setTimeout(function () {
										if (source.length < json.rockstarAccountList.total) {
											RetrieveRockstarAccounts(retrieveUrl, actionUrl, actionCallback, source, (pageIndex + 1), pageSize);
										} else {
											$('.nt-swal-retrieving').hide();
											$('.nt-swal-progress').show();
											ProcessRockstarAccounts(actionUrl, actionCallback, source);
										}
									}, APP_REQUEST_DELAY);
								},
								error: function (error) {
									LogRequest("Couldn't fetch the friends list in RetrieveRockstarAccounts().", this, error);

									swal(
										GetTimedSwalArgs(
											"error",
											error.status + " - " + error.statusText,
											"Something went wrong while trying to fetch data from page " + pageIndex + "."
										)
									);
								}
							});
						} catch (err) {
							LogError("Something went wrong in RetrieveRockstarAccounts().", err);
							return;
						}
					}

					function ProcessRockstarAccounts(actionUrl, actionCallback, source, errorObjects) {
						try {
							if (actionUrl === undefined) throw new Error('No action URL supplied.');
							if (actionCallback === undefined) throw new Error('No action callback supplied.');
							if (source === undefined) throw new Error('No rockstar accounts source supplied.');

							if (errorObjects === undefined) errorObjects = [];

							var CompleteFunction = function () {
								$('.nt-swal-progress-current').text(source.length);

								setTimeout(function () {
									if (source.length > 0) {
										ProcessRockstarAccounts(actionUrl, actionCallback, source, errorObjects);
										return;
									}

									actionCallback(errorObjects);
								}, APP_REQUEST_DELAY);
							}

							var item = source.pop();
							if (item === undefined) {
								LogError("An item has been skipped.", "The current item is undefined, also I'm a teapot.");
								CompleteFunction();
								return;
							}

							LogInfo("Popped the items list in ProcessRockstarAccounts().", item);

							if (debug === 1) {
								item.rockstarId = 'x';
							}

							DoRequest({
								url: `${actionUrl}?rockstarId=${item.rockstarId}`,
								method: 'POST',
								success: function (json) {
									LogRequest("Successfully processed the popped item in ProcessRockstarAccounts().", this, json);

									if (json.status != true) errorObjects.push(item.name);

									CompleteFunction();
								},
								error: function (error) {
									LogRequest("Couldn't process the popped item in ProcessRockstarAccounts().", this, error);

									errorObjects.push(item.name);

									CompleteFunction();
								}
							});
						} catch (err) {
							LogError("Something went wrong in ProcessRockstarAccounts().", err);
							return;
						}
					}

					function RetrieveBlockedList(source) {
						try {
							var target = [];

							setTimeout(function () {
								DoLegacyGetRequest({
									url: APP_LINK_SC + "/friends/GetBlockedJson",
									error: function (err) {
										LogRequest("Couldn't fetch blocked users list in RetrieveBlockedList().", this, err);

										swal(
											GetTimedSwalArgs(
												"error",
												err.status + " - " + err.statusText,
												"Something went wrong while trying to retrieve blocked users."
											)
										);
									},
									success: function (data) {
										LogRequest("Successfully fetched blocked users list in RetrieveBlockedList().", this, data);

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
													GetTimedSwalArgs(
														"error",
														"User blocked",
														"<strong>" + source.Nickname + "</strong> is on your blocked users list. To be able to send them a friend request, remove them from your blocked users list, then try again."
													)
												);
											}
										} else {
											swal(
												GetTimedSwalArgs(
													"error",
													"Something went wrong",
													"Something went wrong while trying to retrieve blocked users."
												)
											);
										}
									}
								});
							}, APP_REQUEST_DELAY)
						} catch (err) {
							LogError("Something went wrong in RetrieveBlockedList().", err);
							return;
						}
					}

					function AddFriend(source) {
						try {
							DoLegacyDataRequest({
								url: APP_LINK_SC + "/friends/UpdateFriend",
								type: "PUT",
								data: {
									"id": source.RockstarId,
									"op": "addfriend",
									"custommessage": friendMessage
								},
								error: function (err) {
									LogRequest("Couldn't complete add " + source.Nickname + " in AddFriend().", this, err);

									swal(
										GetTimedSwalArgs(
											"error",
											err.status + " - " + err.statusText,
											"Something went wrong trying to add <strong>" + source.Nickname + "</strong>."
										)
									);
								},
								success: function (data) {
									LogRequest("Successfully completed add " + source.Nickname + " in AddFriend().", this, data);

									if (data.Status == true) {
										swal(
											GetTimedSwalArgs(
												"success",
												"User added",
												"<p>A friend request has been sent to <strong>" + source.Nickname + "</strong>.</p><p>To view the changes to your friends list, please refresh the page.</p>",
											)
										);
									} else {
										swal(
											GetTimedSwalArgs(
												"error",
												"Something went wrong",
												"Something went wrong trying to add <strong>" + source.Nickname + "</strong>."
											)
										);
									}
								}
							});
						} catch (err) {
							LogError("Something went wrong in AddFriend().", err);
							return;
						}
					}

					function AcceptFriend(source) {
						try {
							DoLegacyDataRequest({
								url: APP_LINK_SC + "/friends/UpdateFriend",
								type: "PUT",
								data: {
									"id": source.RockstarId,
									"op": "confirm",
									"accept": "true"
								},
								error: function (err) {
									LogRequest("Couldn't complete accept " + source.Nickname + "'s friend request in AcceptFriend().", this, err);

									swal(
										GetTimedSwalArgs(
											"error",
											err.status + " - " + err.statusText,
											"Something went wrong trying to accept <strong>" + source.Nickname + "</strong>'s friend request."
										)
									);
								},
								success: function (data) {
									LogRequest("Successfully completed accept " + source.Nickname + "'s friend request in AcceptFriend().", this, data);

									if (data.Status == true) {
										swal(
											GetTimedSwalArgs(
												"success",
												"User accepted",
												"<p><strong>" + source.Nickname + "</strong> already sent you a friend request, and we accepted it instead of sending a new one.</p><p>To view the changes to your friends list, please refresh the page.</p>",
											)
										);
									} else {
										swal(
											GetTimedSwalArgs(
												"error",
												"Something went wrong",
												"Something went wrong trying to accept <strong>" + source.Nickname + "</strong>'s friend request."
											)
										);
									}
								}
							});
						} catch (err) {
							LogError("Something went wrong in AcceptFriend().", err);
							return;
						}
					}
				} else {
					LogError("In order to use " + APP_NAME + ", you must log into your Social Club account.", "userNickname == \"\" || isLoggedIn != true");

					swal(
						GetPersistentSwalArgs(
							"error",
							"Log in required",
							APP_NAME + " requires you to log in to be able to apply changes to your account. Please log into the account you want to use with " + APP_NAME + ", then click the bookmark again."
						)
					);
				}
			} catch (err) {
				LogError("Something went wrong.", err);

				swal(
					GetPersistentSwalArgs(
						"error",
						"An error occured",
						"<p style=\"margin:12px 0!important\">" + APP_NAME + " was unable to complete your request. Please try clicking the bookmark again. If the problem persists, please <a href=\"" + APP_LINK_ISSUES + "\" target=\"_blank\">submit an issue</a> with the details below.</p><p style=\"margin:12px 0!important\">Error:</p><pre>" + err + "</pre>"
					)
				);

				return;
			}
		} else {
			LogError("The current website is not a Social Club website and " + APP_NAME + " can't continue.", "window.location.protocol !== \"https:\" || !window.location.host.endsWith(\"socialclub.rockstargames.com\")");

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
	}, APP_REQUEST_DELAY);
}
