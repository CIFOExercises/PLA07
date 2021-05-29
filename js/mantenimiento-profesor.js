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
          document.querySelector('.modificar-formador').removeAttribute('disabled')
          document.querySelector('.baixa-formador').removeAttribute('disabled')
          consultaProfesor(this.children[0].textContent);
        };
      });
    });
})();


let form = document.forms.namedItem("manteniment-profesor");
form.onsubmit = handleRequest;

function handleRequest(e) {
  e.preventDefault();

  let isValid = validateForm();
  if (!isValid) return;

  console.log("Ha pasado la validacion");

  let data = new FormData();
  data.append("nombre", form.firstName.value);
  data.append("usuario", form.user.value);
  data.append("email", form.email.value);
  data.append("password", form.password.value);

  //Enviar Peticion al servidor: https://alcyon-it.com/PQTM/pqtm_alta_profesores.php
  sendRequest(data);
}

function validateForm() {
  if (form.checkValidity()) {
    if (
      !form.firstName.value ||
      !form.user.value ||
      !form.email.value ||
      !form.password.value
    ) {
      console.log("hay almenos un campo que no esta informado");
      return false;
    }

    let regex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/g;
    if (!regex.test(form.email.value)) {
      form.email.setCustomValidity("El email no tiene el formato correcto");
      form.reportValidity();
      return false;
    }
  } else {
    form.reportValidity();
    return false;
  }
  return true;
}

function sendRequest(data) {
  let headers = {
    method: "POST",
    body: data
  };

  fetch("https://alcyon-it.com/PQTM/pqtm_alta_profesores.php", headers)
    .then((res) => {
      if (res.ok) {
        return res.text();
      } else {
        throw "Algo ha ido mal en la llamada";
      }
    })
    .then((msg) => alert(msg))
    .catch((err) => alert(err));
}

function consultaProfesor(teacherId) {

  let data = new FormData();
  data.append('tipoconsulta', 'P')
  data.append('id', teacherId)

  let headers = {
    method: 'POST',
    body: data
  }

  fetch('https://alcyon-it.com/PQTM/pqtm_consulta_profesores.php', headers)
    .then((res) => {
      if (res.ok) {
        return res.json();
      }
    })
    .then((res) => {
      console.log(res[0])


    })
    .catch((error) => alert(error))
}