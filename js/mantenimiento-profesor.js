(() => {
  let data = new FormData();
  data.append("tipoconsulta", "A");

  let headers = {
    method: "POST",
    body: data
  };

  fetch("https://alcyon-it.com/PQTM/pqtm_consulta_profesores.php", headers)
    .then((res) => {
      if (res.ok) {
        return res.json();
      }
    })
    .then((res) => {
      for (const item of res) {
        document.querySelector(".table").innerHTML += `
          <tr class='table-item'>
              <td>${item.idteacher}</td>
              <td>${item.nombre}</td>
              <td>${item.tipo === "TC" ? "Teacher" : "Administrator"}</td>
          </tr>
          `;
      }
      document.querySelectorAll(".table-item").forEach((item) => {
        item.onclick = function () {
          document.querySelectorAll(".table-item").forEach((item) => {
            item.style.backgroundColor = "transparent";
          });
          this.style.backgroundColor = "white";
          document
            .querySelector(".modificar-formador")
            .removeAttribute("disabled");
          document.querySelector(".baixa-formador").removeAttribute("disabled");
          consultaProfesor(this.children[0].textContent);
        };
      });
    });
})();

function consultaProfesor(teacherId) {
  let data = new FormData();
  data.append("tipoconsulta", "P");
  data.append("id", teacherId);

  let headers = {
    method: "POST",
    body: data
  };

  fetch("https://alcyon-it.com/PQTM/pqtm_consulta_profesores.php", headers)
    .then((res) => {
      if (res.ok) {
        return res.json();
      }
    })
    .then((res) => {
      console.log(res[0]);
      document
        .querySelector("#idprofesor")
        .setAttribute("value", res[0].idteacher);
      document.querySelector("#firstName").setAttribute("value", res[0].nombre);
      document.querySelector("#user").setAttribute("value", res[0].user);
      document.querySelector("#email").setAttribute("value", res[0].email);

      document.querySelector("#type").value = res[0].tipo;
    })
    .catch((error) => alert(error));
}
