//Recuperar todos los datos del formulario

// Validar que todos los campos no esten vacios

// Validar el correcto formato del email con un regexp

// Si no hay errores realizar llamada asincrona a https://alcyion-it.com/PQTM/pqtm_alta_profesores.php

// Utilizaremos el metodo POST y pasaremos exactamente los siguientes parametros:
/**
 * nombre
 * usuario
 * email
 * password
 */

// Recoger la respuesta y evaluarla para mostrar una alerta con el resultado de la peticion

let form = document.forms.namedItem("alta-profesor");
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
