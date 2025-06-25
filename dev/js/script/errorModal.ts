export const initCloseModal = () => {

  const modal = document.querySelector(".js-form-error");
  const closeBtn = modal?.querySelector('.js-close');
  
  const closeModal = () => {
    modal.classList.remove('active');
  }
  
  closeBtn?.addEventListener("click", closeModal);
}

export const initSuccessModal = () => {
  const modal = document.querySelector(".js-form-success");
  const closeBtn = modal?.querySelector(".js-close");

  const closeModal = () => {
    modal.classList.remove("active");
  };
  
  closeBtn?.addEventListener("click", closeModal);
}
