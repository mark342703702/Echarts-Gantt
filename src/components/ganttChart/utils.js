export function formatTime(date, type = "full") {
  // 获取年、月、日、时、分、秒
  const tempDate = new Date(date);
  const year = tempDate.getFullYear();
  const month = tempDate.getMonth() + 1 < 10 ? `0${tempDate.getMonth() + 1}` : tempDate.getMonth() + 1;
  const day = tempDate.getDate() < 10 ? `0${tempDate.getDate()}` : tempDate.getDate();
  const hour = tempDate.getHours() < 10 ? `0${tempDate.getHours()}` : tempDate.getHours();
  const minute = tempDate.getMinutes() < 10 ? `0${tempDate.getMinutes()}` : tempDate.getMinutes();
  const second = tempDate.getSeconds() < 10 ? `0${tempDate.getSeconds()}` : tempDate.getSeconds();

  // 拼接成想要的格式
  if (type === "full") return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
  else if (type === "hms") {
    return `${hour}:${minute}:${second}`;
  } else
    return {
      year,
      month,
      day,
      hour,
      minute,
      second
    };
}
export function debounce(func, delay) {
  let timerId;

  return function(...args) {
    clearTimeout(timerId);
    timerId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}
// 生成唯一标识
function setStr() {
  return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}
export function guid() {
  return setStr() + setStr();
}

export const getDataZoom = (startTime, endTime, timeMaxinterval) => {
  const now = new Date().getTime();
  const [start, end] = [new Date(startTime).getTime(), new Date(endTime).getTime()];
  const dataZoomStart = ((now - start) / (end - start)) * 100 - (30 * timeMaxinterval) / (end - start);
  const dataZoomEnd = dataZoomStart + ((5 * timeMaxinterval) / (end - start)) * 100;
  return {
    dataZoomStart,
    dataZoomEnd
  };
};
