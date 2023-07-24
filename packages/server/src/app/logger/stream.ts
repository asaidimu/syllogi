import { Writable } from "stream";

export function createBufferStream(stream: Writable, interval: number) {
  let timer: any = null;
  const buffer: Array<String> = [];

  const flush = () => {
    stream.write(buffer.join(""));
    buffer.splice(0, buffer.length);
  };
  const write = (data: string) => {
    if (timer === null) {
      timer = setTimeout(flush, interval);
    }
    buffer.push(data);
  };

  setInterval(flush, interval);

  return { write };
}
