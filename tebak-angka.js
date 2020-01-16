$(document).ready(function() {
	const randomNumber = Math.ceil(Math.random() * 100);
	let kesempatan = 10;
	let userData = JSON.parse(localStorage.getItem("userData"));

	$("#kesempatan").html(kesempatan);
	$("#successMessage").hide();

	if (userData) {
		$("#btnLogin").hide();
		$("#btnLogout").show();
		$("#welcomeMessage").html(
			"Selamat Datang, " +
				userData.displayName +
				" <img src='" +
				userData.pictureUrl +
				"'>"
		);
	} else {
		$("#btnLogin").show();
		$("#btnLogout").hide();
	}

	$("#btnTebak").click(function() {
		let value = $("#inputValue").val();

		if (!userData) {
			Swal.fire({
				icon: "warning",
				title: "Oops...",
				text: "Login dulu bosku!"
			});
		} else {
			showResult(value);
		}
	});

	function showResult(value) {
		let icon = "";
		let title = "";
		let text = "";
		let showRefresh = kesempatan === 0 ? true : false;

		if (value == randomNumber) {
			icon = "success";
			title = "Keren!";
			text = "Angka yang kamu tebak benar!";
			$("#successMessage").show();
		} else if (value === "") {
			icon = "info";
			title = "Terjadi Kesalahan";
			text = "Angka ga boleh kosong!";
		} else if (value > randomNumber && value <= 100) {
			icon = "error";
			title = "Salah";
			text = "Kegedean angkanya bro... Ayo Coba Lagi!";
			kesempatan -= 1;
		} else if (value < randomNumber && value >= 0) {
			icon = "error";
			title = "Salah";
			text = "Waduh, kekecilan nih.. Coba lagi!";
			kesempatan -= 1;
		} else if (value < 0) {
			icon = "info";
			title = "Terjadi Kesalahan";
			text = "Angka ga boleh kurang dari 0";
		} else if (value > 100) {
			icon = "info";
			title = "Terjadi Kesalahan";
			text = "Angka ga boleh lebih dari 100";
		} else {
			icon = "info";
			title = "Terjadi Kesalahan";
			text = "Yang Kamu masukkan bukan angka!";
		}

		if (showRefresh) {
			Swal.queue([
				{
					title: "Reset!",
					confirmButtonText: "Refresh",
					text: "Refresh ulang browser",
					showLoaderOnConfirm: true,
					preConfirm: () => {
						return window.location.reload();
					}
				}
			]);
		} else {
			Swal.fire({
				icon: icon,
				title: title,
				text: text
			});
			$("#kesempatan").html(kesempatan);
		}
	}
});
