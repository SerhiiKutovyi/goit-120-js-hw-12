export const btnDisabled = on => {
  on.disabled = true;
};

export const btnEnabled = off => {
  off.disabled = false;
};

export const windowScrollBy = height => {
  window.scrollBy({
    top: height * 2,
    behavior: 'smooth',
  });
};
