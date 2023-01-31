export const delay = (time) =>
  new Promise((resolve) => {
    setTimeout(() => resolve(1), time);
  });

export const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-us", {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
