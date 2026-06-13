import poster1 from '../assets/poster1.png';
import poster2 from '../assets/poster2.png';

export default function Poster() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">
        testing
      </h1>

      <div className="grid md:grid-cols-2 gap-4">
        <img
          src={poster1}
          alt="海報1"
          className="rounded-lg shadow-lg"
        />

        <img
          src={poster2}
          alt="海報2"
          className="rounded-lg shadow-lg"
        />
      </div>
    </div>
  );
}