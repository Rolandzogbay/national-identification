document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById('idForm');
  const formField = document.getElementById('formField')
  const idDisplay = document.getElementById('idDisplay');

  const userPhotoDisplay = document.getElementById('userPhotoDisplay');
  const outSurname = document.getElementById('displaySurname');
  const outFirstname = document.getElementById('displayFirstname');
  const outMiddlename = document.getElementById('displayMiddlename');
  const outDOB = document.getElementById('displayDOB');
  const outStatus = document.getElementById('displayStatus');
  const outSex = document.getElementById('displaySex');
  const outHeight = document.getElementById('displayHeight');
  const outNIN = document.getElementById('displayNIN');
  const outExpiry = document.getElementById('displayExpiry');
  const clearBtn = document.getElementById('clearData');

  const savedData = localStorage.getItem("userData");

  if (savedData) {
    const data = JSON.parse(savedData);
    displayCard(data);   
    form.style.display = "none"; 
  } else {
    idDisplay.style.display = "none"; 
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const photoInput = document.getElementById('userPhotoUpload');
    const surname = document.getElementById('surname').value;
    const firstname = document.getElementById('firstname').value;
    const middlename = document.getElementById('middlename').value;
    const dob = document.getElementById('dob').value;
    const status = document.getElementById('status').value;
    const sex = document.getElementById('sex').value;
    const height = document.getElementById('height').value;
    const expiry = document.getElementById('expiry').value;
    const nin = generateRandomNIN();

    const file = photoInput.files[0];
    const reader = new FileReader();
    reader.onload = function(e) {
      const userData = {
        surname,
        firstname,
        middlename,
        dob,
        status,
        sex,
        height,
        nin,
        expiry,
        photo: e.target.result
      };

      
      localStorage.setItem("userData", JSON.stringify(userData));

      displayCard(userData);

      formField.style.display = "none";
      form.reset()
    };
    reader.readAsDataURL(file);
  });

  function displayCard(data) {
    idDisplay.style.display = "block";

    outSurname.textContent = data.surname;
    outFirstname.textContent = data.firstname;
    outMiddlename.textContent = data.middlename;
    outDOB.textContent = data.dob;
    outStatus.textContent = data.status;
    outSex.textContent = data.sex;
    outHeight.textContent = data.height;
    outNIN.textContent = data.nin;
    outExpiry.textContent = data.expiry;
    userPhotoDisplay.src = data.photo;

    generateQRCode(data);
  }

  function generateRandomNIN() {
    let nin = '';
    for (let i = 0; i < 11; i++) {
      nin += Math.floor(Math.random() * 10);
    }
    return nin;
  }

  function generateQRCode(data) {
    const qrCodeContainer = document.getElementById('qrCode');
    if (!qrCodeContainer) return;
    qrCodeContainer.innerHTML = '';
    new QRCode(qrCodeContainer, {
      text: JSON.stringify({
        surname: data.surname,
        firstname: data.firstname,
        nin: data.nin,
        dob: data.dob,
        sex: data.sex
      }),
      width: 200,
      height: 200,
    });
  }

  const editBtn = document.getElementById('editData');
  editBtn.addEventListener('click', () => {
  const savedData = JSON.parse(localStorage.getItem("userData"));
  if (!savedData) {
    alert("No saved data to edit.");
    return;
  }

  document.getElementById('surname').value = savedData.surname;
  document.getElementById('firstname').value = savedData.firstname;
  document.getElementById('middlename').value = savedData.middlename;
  document.getElementById('dob').value = savedData.dob;
  document.getElementById('status').value = savedData.status;
  document.getElementById('sex').value = savedData.sex;
  document.getElementById('height').value = savedData.height;
  document.getElementById('expiry').value = savedData.expiry;

  document.getElementById('idForm').style.display = "block";
  document.getElementById('idDisplay').style.display = "none";
  });
  clearBtn.addEventListener('click', () => {
    localStorage.removeItem("userData");
    form.style.display = "block";
    idDisplay.style.display = "none";
    alert("All saved data has been cleared!");
  });

//   This features added provide a way for the user to download or print their card
    document.getElementById('printCard').addEventListener('click', () => {
    const card = document.getElementById('idDisplay').innerHTML;
    const originalContent = document.body.innerHTML;
    
    const buttons = document.querySelector('.buttons');
    const cardHeading = document.querySelector('.card-heading')
    cardHeading.style.display = 'none';
    buttons.style.display = 'none';
    document.body.innerHTML = card;
    window.print();
    
    document.body.innerHTML = originalContent;
    window.location.reload(); 
    
  });

    document.getElementById('downloadCard').addEventListener('click', () => {
    const card = document.getElementById('idDisplay');

    const buttons = document.querySelector('.buttons');
    buttons.style.display = 'none';
    
    html2canvas(card, { scale: 3 }).then(canvas => {
        const link = document.createElement('a');
        link.download = 'Liberia_National_ID.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    });
  });

});