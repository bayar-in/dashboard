// import { endpointLogin } from "./../helper/url.js";
// console.log(endpointLogin);

// document
//   .querySelector(".login-form")
//   .addEventListener("submit", async function (event) {
//     event.preventDefault();
//     const formData = new FormData(this);
//     const data = Object.fromEntries(formData);

//     const response = await fetch(
//       "https://asia-southeast2-awangga.cloudfunctions.net/bayarin/auth/log-in",
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(data),
//       }
//     );

//     const responseData = await response.json();

//     if (response.ok) {
//       localStorage.setItem("isLoggedIn", true);
//       localStorage.setItem("token", responseData.token);
//       window.location.replace("./../dashboard/dashboard.html");
//       alert("Login berhasil");
//       console.log(responseData);
//     } else {
//       alert(responseData.message || "Login gagal, periksa kembali data Anda.");
//       console.log(responseData); // untuk memeriksa error dari server
//     }
//   });

// document.addEventListener("DOMContentLoaded", function () {
//   const signInBtn = document.getElementById("sign-in-btn");

//   if (localStorage.getItem("isLoggedIn") === "true") {

//     signInBtn.textContent = "Log out";
//     signInBtn.href = "#";
//     signInBtn.addEventListener("click", logout);
//   } else {

//     signInBtn.href = "./../dashboard/dashboard.html";
//   }
// });

function logout() {
  // Hapus status login dan token dari localStorage
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("token");
  window.Cookies.remove("login");

  // Redirect ke halaman login atau homepage
  window.location.href = "/bayar-in.github.io/index.html";
}

// Fungsi untuk memeriksa status login
function checkLoginStatus() {
  const isLoggedIn = window.Cookies.get("login");

  // Jika belum login, tampilkan alert dan redirect ke halaman login
  if (isLoggedIn) {
    // Jika cookie ada, redirect ke dashboard
    Swal.fire({
      title: "Sukses",
      text: "Login Berhasil!!",
      icon: "success",
      confirmButtonText: "OK",
    }); // Ganti dengan URL dashboard Anda
  } else {
    // Jika cookie tidak ada, tampilkan alert atau lakukan tindakan lain
    Swal.fire({
      title: "Akses Ditolak",
      text: "Anda belum login. Silakan login terlebih dahulu.",
      icon: "warning",
      confirmButtonText: "OK",
    }).then(() => {
      window.location.href = "/login"; // Redirect ke halaman login
    });
  }
}

// Event listener saat DOM selesai dimuat
document.addEventListener("DOMContentLoaded", () => {
  // Periksa status login
  checkLoginStatus();

  // Tambahkan event listener ke tombol logout
  const logoutLinks = document.querySelectorAll('[onclick="logout()"]');
  logoutLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault(); // Cegah default link behavior
      logout();
    });
  });
});

// document.querySelector(".login-form").addEventListener("submit", async function (event) {
//     event.preventDefault();
//     const formData = new FormData(this);
//     const data = Object.fromEntries(formData);
//     const response = await fetch("http://localhost:8080/login", {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//         },
//         body: JSON.stringify(data),
//     });
//     const responseData = await response.json();
//     if (response.ok) {
//         localStorage.setItem("token", responseData.token);
//         window.location.replace("/index.html");
//         alert("percobaan berhasil");
//         console.log(responseData);

//     } else {
//         alert(responseData.message);
//     }
// });

// function getUserDetails() {
//     return fetch(endpointLogin, {
//         headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//     }).then((response) => response.json());
// }

document.addEventListener("DOMContentLoaded", function () {
  // URL endpoint API
  const apiUrl =
    "https://asia-southeast2-awangga.cloudfunctions.net/bayarin/data/user"; // Endpoint API sebenarnya

  // Fungsi untuk fetch data user dari API
  async function fetchUserData() {
    try {
      // Ambil token dari cookies dengan key 'login'
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("login="))
        ?.split("=")[1];

      if (!token) {
        throw new Error("Token 'login' not found in cookies");
      }

      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          login: `${token}`, // Token dikirim di header login
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const userData = await response.json();

      // Update elemen di DOM
      updateProfileSection(userData);
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    }
  }

  // Fungsi untuk memperbarui profile section
  function updateProfileSection(user) {
    // Update foto profil default (karena data API tidak menyertakan profilePicture)
    const profileImg = document.querySelector(".profile img");
    profileImg.src = "https://via.placeholder.com/150"; // Gunakan foto default

    // Update nama di bagian profile
    const profileName = document.querySelector(".profile h2");
    profileName.textContent = user.name || "No Name";

    // Update role (pekerjaan) di bagian profile
    const profileRole = document.querySelector(".profile p");
    profileRole.textContent = user.role || "No Role";

    // Update informasi personal di bagian details
    const infoName = document.querySelector(".info p:nth-child(2)");
    const infoEmail = document.querySelector(".info p:nth-child(3)");
    const infoPhone = document.querySelector(".info p:nth-child(4)");

    infoName.innerHTML = `<span>Name:</span> ${user.name || "No Name"}`;
    infoEmail.innerHTML = `<span>Email:</span> ${user.email || "No Email"}`;
    infoPhone.innerHTML = `<span>Phone:</span> ${
      user.phonenumber || "No Phone"
    }`;
  }

  // Panggil fungsi fetch data user
  fetchUserData();
});
