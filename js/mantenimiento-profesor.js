function loadTable() {
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
      document.querySelector(".table").innerHTML = "";
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
          document.querySelector('#idprofesor').value = this.children[0].textContent;
        };
      });
    });
}

(() => {
  loadTable()
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
      } else {
        throw "Algo ha ido mal en la llamada";
      }
    })
    .then((res) => {
      document.querySelector("#idprofesor").value = res[0].idteacher;
      document.querySelector("#firstName").value = res[0].nombre;
      document.querySelector("#user").value = res[0].user;
      document.querySelector("#email").value = res[0].email;
      document.querySelector("#type").value = res[0].tipo;
    })
    .catch((error) => alert(error));
}

document.forms.namedItem('manteniment-profesor').onsubmit = handleSubmit;

function handleSubmit(e) {
  e.preventDefault();

  switch (e.submitter.name) {
    case 'alta-formador':
      // addProfesor();
      break;
    case 'modificar-formador':
      updateProfesor();
      break;
    case 'baixa-formador':
      removeProfesor();
      break;

    default:
      break;
  }
}

function refreshTable() {
  loadTable();
}

function validarCampos() {
  let form = document.forms.namedItem('manteniment-profesor')

  let idprofesor = parseInt(document.querySelector('#idprofesor').value)
  let name = document.querySelector('#firstName').value
  let user = document.querySelector('#user').value
  let email = document.querySelector('#email').value
  let type = document.querySelector('#type').value

  if (form.checkValidity()) {
    if (!idprofesor || !name || !user || !email || !type) {
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

  let profesor = {}
  profesor.idprofesor = idprofesor
  profesor.name = name
  profesor.user = user
  profesor.email = email
  profesor.type = type
  return profesor;
}

function updateProfesor() {

  let isValid = validarCampos();

  if (!isValid) return;
  let profesor = isValid;

  let data = new FormData();
  data.append("idprofesor", profesor.idprofesor);
  data.append("nombre", profesor.name);
  data.append("email", profesor.email);
  data.append("usuario", profesor.user);
  data.append("tipo", profesor.type);

  let headers = {
    method: "POST",
    body: data
  };

  fetch('https://alcyon-it.com/PQTM/pqtm_modificacion_profesores.php', headers)
    .then((res) => {
      if (res.ok) {
        return res.text();
      } else {
        throw "Algo ha ido mal en la llamada";
      }
    })
    .then((res) => {
      if(res.substring(0,2) !== '00') throw res.substring(2)
      alert(res.substring(2));
      refreshTable();
    })
    .catch((error) => alert(error));
}

function removeProfesor() {
  let idProfesor = parseInt(document.querySelector('#idprofesor').value)

  if (!idProfesor) return;

  let data = new FormData();
  data.append("idprofesor", idProfesor);

  let headers = {
    method: "Post",
    body: data
  };

  fetch('https://alcyon-it.com/PQTM/pqtm_baja_profesores.php', headers)
    .then((res) => {
      if (res.ok) {
        return res.text();
      } else {
        throw "Algo ha ido mal en la llamada";
      }
    })
    .then((res) => {
      if(res.substring(0,2) !== '00') throw res.substring(2)
      alert(res.substring(2));
      refreshTable();
      document.querySelector('#manteniment-profesor').reset();
      document.querySelector(".modificar-formador").toggleAttribute("disabled");
      document.querySelector(".baixa-formador").toggleAttribute("disabled");
    })
    .catch((error) => alert(error));
}