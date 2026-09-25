import type { IgpuFamily } from "../data/cpus";
import { MEDIA } from "../lib/media";

const yn = (b: boolean) => (b ? <span className="yes">Yes</span> : <span className="no">No</span>);

export function MediaTable({ families }: { families: IgpuFamily[] }) {
  const uniq = [...new Set(families)];
  return (
    <div className="table-scroll">
      <table className="grid-table">
        <thead>
          <tr><th scope="col">Video engine</th><th scope="col">H.264</th><th scope="col">HEVC 10-bit decode</th><th scope="col">VP9</th><th scope="col">AV1 decode</th><th scope="col">HEVC encode</th></tr>
        </thead>
        <tbody>
          {uniq.map((f) => {
            const c = MEDIA[f];
            return (
              <tr key={f}>
                <th scope="row">{c.label}</th>
                <td>{yn(c.decode.h264)}</td><td>{yn(c.decode.hevc10)}</td><td>{yn(c.decode.vp9)}</td><td>{yn(c.decode.av1)}</td><td>{yn(c.encode.hevc)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
