import poster1 from '../assets/poster1.png';
import poster2 from '../assets/poster2.png';
import poster3 from '../assets/poster3.png';

export default function Poster() {
  const posters = [
    {
      img: poster1,
      title: '標題',
      content: '內文'
    },
    {
      img: poster2,
      title: '標題',
      content: '內文'
    },
    {
      img: poster3,
      title: '標題',
      content: '內文'
    }
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">
        防災資訊海報
      </h1>

      <div className="grid md:grid-cols-3 gap-6">
        {posters.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-lg overflow-hidden"
          >
            {/* 圖片：保留原比例，不裁切 */}
            <div className="bg-gray-100 flex justify-center">
              <img
                src={item.img}
                alt=""
                className="w-full h-auto object-contain"
              />
            </div>

            {/* 文字區 */}
            <div className="p-4 space-y-2">
              <h2 className="text-lg font-bold">
                {item.title}
              </h2>

              <p className="text-sm text-gray-600 leading-relaxed">
                {item.content}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}