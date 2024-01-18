let draggedCard = null;
let originColumn = null;
// 드래그 앤 드롭 설정
function setupDragAndDrop() {
  const cards = document.querySelectorAll('.schedule');
  const columns = document.querySelectorAll('.day');

  // 카드에 대한 이벤트 리스너 설정
  cards.forEach((card) => {
    card.setAttribute('draggable', true);
    card.addEventListener('dragstart', handleDragStart);
    card.addEventListener('dragend', handleDragEnd);
  });

  // 컬럼에 대한 이벤트 리스너 설정
  columns.forEach((column) => {
    column.addEventListener('dragover', handleDragOver);
    column.addEventListener('drop', handleDrop);
  });
  // console.log('너 동작은 하니?');
}

// 드래그 시작 시 호출
function handleDragStart(event) {
  draggedCard = event.target;
  originColumn = draggedCard.closest('.day');
  // console.log('Drag Start:', draggedCard);
}

// 드래그 종료 시 호출
function handleDragEnd() {
  // console.log('Drag End');
  draggedCard = null;
  originColumn = null;
}

// 드래그 오버 시 호출
function handleDragOver(event) {
  event.preventDefault();
  // console.log('Drag Over');
}
// 드롭 시 호출
function handleDrop(event) {
  event.preventDefault();
  const targetColumn = event.target.closest('.day');
  const targetCardList = targetColumn.querySelector('.scheduleList');

  if (targetCardList && draggedCard) {
    const cards = Array.from(targetCardList.children);
    const droppedIndex = cards.indexOf(event.target.closest('.schedule'));

    targetCardList.insertBefore(draggedCard, cards[droppedIndex]);
    const cardElements = Array.from(targetCardList.children);
    const numberOfCards = cardElements.length;
    console.log(`카드의 개수: ${numberOfCards}`);
    // updateCardPosition(draggedCard, originColumn, targetColumn, droppedIndex);
  }
}

setupDragAndDrop();
// function updateCardPosition(card, originColumn, newColumn, newIndex) {
//   const cardId = card.getAttribute('data-card-id');
//   const originColumnId = originColumn.getAttribute('data-column-id');
//   const newColumnId = newColumn.getAttribute('data-column-id');

//   const urlParams = new URLSearchParams(window.location.search);
//   const boardId = urlParams.get('boardId');
//   const accessToken = localStorage.getItem('access_token');

//   if (newColumnId !== originColumnId) {
//     // 다른 컬럼으로 이동
//     axios
//       .patch(
//         `/board/${boardId}/column/${originColumnId}/cardMove/${cardId}`,
//         { destinationColumnId: newColumnId },
//         {
//           headers: { Authorization: `Bearer ${accessToken}` },
//         },
//       )
//       .then(() => console.log('Card moved successfully'))
//       .catch((error) => console.error('Error moving card', error));
//   } else {
//     // 같은 컬럼 내에서 위치 변경
//     const newOrder = newIndex; // 서버에 보낼 새 순서는 드롭된 인덱스 + 1

//     // console.log(
//     //   boardId,
//     //   'boardId',
//     //   newColumnId,
//     //   'columnId',
//     //   cardId,
//     //   'cardId',
//     //   newOrder,
//     //   'newOrder',
//     // );
//     axios
//       .patch(
//         `/board/${boardId}/column/${newColumnId}/cardOrder`,
//         { cardId: cardId, newOrder: newOrder },
//         {
//           headers: { Authorization: `Bearer ${accessToken}` },
//         },
//       )
//       .then(() => console.log('Card order updated successfully'))
//       .catch((error) => console.error('Error updating card order', error));
//   }
// }
