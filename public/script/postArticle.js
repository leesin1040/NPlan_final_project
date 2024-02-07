document.getElementById('imgBtn').addEventListener('click', function () {
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = 'image/*';
  fileInput.click();
  fileInput.onchange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      axios
        .post('/api/article/img', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then((response) => {
          const imageUrl = response.data.imageUrl[0];
          if (imageUrl) {
            const imgElement = document.createElement('img');
            imgElement.src = imageUrl;
            imgElement.style.maxWidth = '800px'; // 이미지 최대 너비 설정
            writingArea.appendChild(imgElement);
          }
        })
        .catch((error) => {
          console.error('업로드 실패:', error);
        });
    }
  };
});

document.getElementById('postingButton').addEventListener('click', function () {
  const articleTitle = document.getElementById('articleTitle').value;
  const editorContent = document.getElementById('text-input').innerHTML;
  if (!articleTitle || !editorContent.trim()) {
    alert('제목과 내용을 모두 입력하세요.');
    return;
  }
  const articleData = {
    articleTitle,
    editorContent,
  };
  axios
    .post('/api/article/posting', articleData, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then((response) => {
      if (response.status === 201) {
        alert('게시글이 성공적으로 생성되었습니다.');
        window.location.href = '/articles';
      }
    })
    .catch((error) => {
      console.error('게시글 생성 실패:', error);
      alert('게시글 생성에 실패했습니다. 다시 시도해주세요.');
    });
});

let optionsButtons = document.querySelectorAll('.option-button');
let advancedOptionButton = document.querySelectorAll('.adv-option-button');
let fontName = document.getElementById('fontName');
let fontSizeRef = document.getElementById('fontSize');
let writingArea = document.getElementById('text-input');
let linkButton = document.getElementById('createLink');
let alignButtons = document.querySelectorAll('.align');
let spacingButtons = document.querySelectorAll('.spacing');
let formatButtons = document.querySelectorAll('.format');
let scriptButtons = document.querySelectorAll('.script');

let fontList = [
  'Arial',
  'Verdana',
  'Times New Roman',
  'Garamond',
  'Georgia',
  'Courier New',
  'Cursive',
];

const intializer = () => {
  highlighter(alignButtons, true);
  highlighter(spacingButtons, true);
  highlighter(formatButtons, false);
  highlighter(scriptButtons, true);

  fontList.map((value) => {
    let option = document.createElement('option');
    option.value = value;
    option.innerHTML = value;
    fontName.appendChild(option);
  });

  for (let i = 1; i <= 7; i++) {
    let option = document.createElement('option');
    option.value = i;
    option.innerHTML = i;
    fontSizeRef.appendChild(option);
  }

  fontSizeRef.value = 3;
};

const modifyText = (command, defaultUi, value) => {
  document.execCommand(command, defaultUi, value);
};

optionsButtons.forEach((button) => {
  button.addEventListener('click', () => {
    modifyText(button.id, false, null);
  });
});

advancedOptionButton.forEach((button) => {
  button.addEventListener('change', () => {
    modifyText(button.id, false, button.value);
  });
});

linkButton.addEventListener('click', () => {
  let userLink = prompt('Enter a URL?');
  if (/http/i.test(userLink)) {
    modifyText(linkButton.id, false, userLink);
  } else {
    userLink = 'http://' + userLink;
    modifyText(linkButton.id, false, userLink);
  }
});

const highlighter = (className, needsRemoval) => {
  className.forEach((button) => {
    button.addEventListener('click', () => {
      if (needsRemoval) {
        let alreadyActive = false;
        if (button.classList.contains('active')) {
          alreadyActive = true;
        }
        highlighterRemover(className);
        if (!alreadyActive) {
          button.classList.add('active');
        }
      } else {
        button.classList.toggle('active');
      }
    });
  });
};

const highlighterRemover = (className) => {
  className.forEach((button) => {
    button.classList.remove('active');
  });
};

window.onload = intializer();
