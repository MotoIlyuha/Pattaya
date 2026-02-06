import { useState, useRef, useEffect } from 'react';

// Данные о часовых поясах
const timezones = {
  moscow: { offset: 3, label: 'Москва', flag: '🇷🇺', city: 'MSK' },
  uae: { offset: 4, label: 'ОАЭ (Шарджа)', flag: '🇦🇪', city: 'GST' },
  thailand: { offset: 7, label: 'Таиланд (Бангкок)', flag: '🇹🇭', city: 'ICT' },
};

// Пассажиры
const passengers = [
  {
    name: 'Осипова Инна Павловна',
    shortName: 'Инна',
    color: 'from-pink-500 to-rose-500',
    bgColor: 'bg-pink-50',
    borderColor: 'border-pink-200',
    tickets: {
      train1: '71010950896704',
      plane: 'TE 5142378678333*',
      train2: '71410951104081',
    },
    seats: {
      train1: 'вагон 09, место 074',
      train2: 'вагон 09, место 040',
    }
  },
  {
    name: 'Моторин Илья Юрьевич',
    shortName: 'Илья',
    color: 'from-blue-500 to-indigo-500',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    tickets: {
      train1: '71 011 307 340 031',
      plane: 'TE 5142378678616',
      train2: '71 411 307 363 923',
    },
    seats: {
      train1: 'вагон 09, место 070',
      train2: 'вагон 09, место 042',
    }
  }
];

// Сегменты маршрута
const WISH_EMOJIS = ['❤️', '🫶', '😎', '👍', '😀'] as const;

// Варианты надписей на кнопке (меняются по нажатию)
const WISH_BUTTON_LABELS: Array<{ main: string}> = [
  { main: 'Пожелать нам мягкой посадки ✈️'}, { main: 'Счастливого путешествия 🌞' },
  { main: 'Пожелать лёгкого пути 🧳'}, {main: 'Удачной поездки ✨' },
];

// Плавающая кнопка пожеланий + летающие "Спасибо"
function WishButton() {
  const [count, setCount] = useState(0);
  const [labelIndex, setLabelIndex] = useState(0);
  const [countVisible, setCountVisible] = useState(false);
  const [bubbles, setBubbles] = useState<Array<{ id: number; emoji: string; xDrift: number; startX: number; delay: number }>>([]);
  const nextId = useRef(0);
  const holdTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const labels = WISH_BUTTON_LABELS[labelIndex % WISH_BUTTON_LABELS.length];

  const clearHoldTimer = () => {
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
  };

  const handlePointerDown = () => {
    clearHoldTimer();
    holdTimerRef.current = setTimeout(() => {
      holdTimerRef.current = null;
      setCountVisible((v) => !v);
    }, 5000);
  };

  const handlePointerUp = () => clearHoldTimer();
  const handlePointerLeave = () => clearHoldTimer();

  const handleClick = () => {
    setCount((c) => c + 1);
    setLabelIndex((i) => i + 1);
    const bubble = {
      id: nextId.current++,
      emoji: WISH_EMOJIS[Math.floor(Math.random() * WISH_EMOJIS.length)],
      xDrift: (Math.random() - 0.5) * 140,
      startX: (Math.random() - 0.5) * 80,
      delay: 0,
    };
    setBubbles((prev) => [...prev, bubble]);
    const idToRemove = bubble.id;
    setTimeout(() => {
      setBubbles((prev) => prev.filter((b) => b.id !== idToRemove));
    }, 2600);
  };

  return (
    <>
      <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 pointer-events-none w-0 h-0">
        {bubbles.map((b) => (
          <div
            key={b.id}
            className="pointer-events-none absolute bottom-0 text-lg font-semibold text-slate-600 whitespace-nowrap flex items-center gap-1"
            style={{
              left: `calc(50% + ${b.startX}px)`,
              '--x-drift': `${b.xDrift}px`,
              animation: 'flyThank 2.2s ease-out forwards',
              animationDelay: `${b.delay}ms`,
              opacity: 0.9,
            } as React.CSSProperties}
          >
            <span className="inline-block opacity-90">Спасибо</span>
            <span className="inline-block text-xl">{b.emoji}</span>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={handleClick}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerLeave}
        onPointerCancel={handlePointerUp}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-105 active:scale-100 transition-all pointer-events-auto border-2 border-amber-300/50"
      >
        <span className="block sm:inline">{labels.main}</span>
        <span className="block sm:inline text-sm opacity-90 mt-0.5">{labels.sub}</span>
        {countVisible && count > 0 && (
          <span className="absolute -top-2 -right-2 min-w-[22px] h-[22px] rounded-full bg-rose-500 text-white text-xs font-bold flex items-center justify-center">
            {count}
          </span>
        )}
      </button>

      <style>{`
        @keyframes flyThank {
          0% {
            transform: translate(-50%, 0);
            opacity: 0;
          }
          10% {
            opacity: 0.9;
          }
          100% {
            transform: translate(calc(-50% + var(--x-drift, 0px)), -200px);
            opacity: 0;
          }
        }
      `}</style>
    </>
  );
}

const segments = [
  {
    id: 1,
    type: 'train',
    icon: '🚄',
    transport: 'Поезд 738 «Ласточка»',
    class: 'сидячий',
    departure: {
      time: '08:08',
      date: '09.02.2026',
      city: 'Ярцево',
      timezone: 'moscow',
    },
    arrival: {
      time: '11:51',
      date: '09.02.2026',
      city: 'Москва Белорусская',
      timezone: 'moscow',
    },
    duration: '3 ч 43 мин',
    waitTime: '~7 дней 12 ч (до самолёта)',
    direction: 'outbound',
  },
  {
    id: 2,
    type: 'plane',
    icon: '✈️',
    transport: 'Самолёт G9-957 Air Arabia',
    class: 'эконом',
    departure: {
      time: '00:30',
      date: '10.02.2026',
      city: 'Москва Домодедово',
      timezone: 'moscow',
    },
    arrival: {
      time: '07:10',
      date: '10.02.2026',
      city: 'Шарджа',
      timezone: 'uae',
    },
    duration: '5 ч 40 мин',
    waitTime: '14 ч 45 мин',
    direction: 'outbound',
  },
  {
    id: 3,
    type: 'plane',
    icon: '✈️',
    transport: 'Самолёт G9-821 Air Arabia',
    class: 'эконом',
    departure: {
      time: '21:55',
      date: '10.02.2026',
      city: 'Шарджа',
      timezone: 'uae',
    },
    arrival: {
      time: '07:10',
      date: '11.02.2026',
      city: 'Бангкок Суварнабхуми',
      timezone: 'thailand',
    },
    duration: '6 ч 15 мин',
    waitTime: '13 дней 10 ч 45 мин',
    waitLabel: '🏝️ Отдых в Таиланде',
    direction: 'outbound',
  },
  {
    id: 4,
    type: 'plane',
    icon: '✈️',
    transport: 'Самолёт G9-817 Air Arabia',
    class: 'эконом',
    departure: {
      time: '17:55',
      date: '24.02.2026',
      city: 'Бангкок Суварнабхуми',
      timezone: 'thailand',
    },
    arrival: {
      time: '21:55',
      date: '24.02.2026',
      city: 'Шарджа',
      timezone: 'uae',
    },
    duration: '7 ч 00 мин',
    waitTime: '10 ч 50 мин',
    direction: 'return',
  },
  {
    id: 5,
    type: 'plane',
    icon: '✈️',
    transport: 'Самолёт G9-950 Air Arabia',
    class: 'эконом',
    departure: {
      time: '08:45',
      date: '25.02.2026',
      city: 'Шарджа',
      timezone: 'uae',
    },
    arrival: {
      time: '13:30',
      date: '25.02.2026',
      city: 'Москва Домодедово',
      timezone: 'moscow',
    },
    duration: '5 ч 45 мин',
    waitTime: null,
    direction: 'return',
  },
  {
    id: 6,
    type: 'train',
    icon: '🚄',
    transport: 'Поезд 737 «Ласточка»',
    class: 'сидячий',
    departure: {
      time: '19:18',
      date: '25.02.2026',
      city: 'Москва Белорусская',
      timezone: 'moscow',
    },
    arrival: {
      time: '23:41',
      date: '25.02.2026',
      city: 'Смоленск Центральный',
      timezone: 'moscow',
    },
    duration: '4 ч 23 мин',
    waitTime: null,
    direction: 'return',
  },
];

function getTimeInTimezone(offset: number): Date {
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  return new Date(utc + 3600000 * offset);
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('ru-RU', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
}

function convertToMoscow(time: string, date: string, fromTimezone: string): string {
  const tz = timezones[fromTimezone as keyof typeof timezones];
  if (fromTimezone === 'moscow') return time;
  
  const [hours, minutes] = time.split(':').map(Number);
  const [day, month, year] = date.split('.').map(Number);
  
  const localDate = new Date(year, month - 1, day, hours, minutes);
  const moscowOffset = timezones.moscow.offset;
  const diff = moscowOffset - tz.offset;
  
  localDate.setHours(localDate.getHours() + diff);
  
  const newHours = localDate.getHours().toString().padStart(2, '0');
  const newMinutes = localDate.getMinutes().toString().padStart(2, '0');
  const newDay = localDate.getDate().toString().padStart(2, '0');
  const newMonth = (localDate.getMonth() + 1).toString().padStart(2, '0');
  
  return `${newHours}:${newMinutes} (${newDay}.${newMonth})`;
}

function WorldClocks() {
  const [times, setTimes] = useState<Record<string, Date>>({});

  useEffect(() => {
    const updateTimes = () => {
      setTimes({
        moscow: getTimeInTimezone(timezones.moscow.offset),
        uae: getTimeInTimezone(timezones.uae.offset),
        thailand: getTimeInTimezone(timezones.thailand.offset),
      });
    };
    updateTimes();
    const interval = setInterval(updateTimes, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="sticky top-0 z-50 py-3 px-4 bg-slate-50/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-3 gap-3 md:gap-6">
          {Object.entries(timezones).map(([key, tz]) => (
            <div
              key={key}
              className="bg-white/80 rounded-xl p-3 md:p-4 flex flex-col items-center justify-center border border-slate-200 shadow-sm min-h-[72px] md:min-h-[88px]"
            >
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-xl md:text-2xl" aria-hidden>{tz.flag}</span>
                <span className="text-slate-500 text-xs md:text-sm font-semibold uppercase tracking-wider">
                  {tz.label.split(' ')[0]}
                </span>
              </div>
              <div className="text-slate-800 text-sm md:text-xl font-mono font-bold tabular-nums">
                {times[key] ? formatTime(times[key]) : '--:--:--'}
              </div>
              <div className="text-slate-400 text-[10px] md:text-xs mt-1">
                {times[key] ? formatDate(times[key]) : '—'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SegmentCard({ segment, index }: { segment: typeof segments[0]; index: number }) {
  const isOutbound = segment.direction === 'outbound';
  const isTrain = segment.type === 'train';
  const depTz = timezones[segment.departure.timezone as keyof typeof timezones];
  const arrTz = timezones[segment.arrival.timezone as keyof typeof timezones];

  return (
    <div className="relative">
      {/* Connector line */}
      {index > 0 && (
        <div className="absolute -top-8 left-8 w-0.5 h-8 bg-gradient-to-b from-gray-200 to-gray-300"></div>
      )}
      
      <div className={`bg-white rounded-2xl shadow-lg border-2 overflow-hidden transition-all hover:shadow-xl ${
        isOutbound ? 'border-emerald-200' : 'border-orange-200'
      }`}>
        {/* Header */}
        <div className={`px-6 py-3 flex items-center justify-between ${
          isOutbound ? 'bg-gradient-to-r from-emerald-500 to-teal-500' : 'bg-gradient-to-r from-orange-500 to-amber-500'
        }`}>
          <div className="flex items-center gap-3">
            <span className="text-2xl">{segment.icon}</span>
            <div className="text-white">
              <div className="font-bold">{segment.transport}</div>
              <div className="text-white/80 text-sm">{segment.class}</div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Departure */}
            <div className="space-y-2">
              <div className="text-gray-400 text-xs font-medium uppercase tracking-wider">Отправление</div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-gray-800">{segment.departure.time}</span>
                <span className="text-gray-500">{segment.departure.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg">{depTz.flag}</span>
                <span className="text-gray-700 font-medium">{segment.departure.city}</span>
              </div>
              {segment.departure.timezone !== 'moscow' && (
                <div className="text-sm text-gray-400 flex items-center gap-1">
                  🇷🇺 МСК: {convertToMoscow(segment.departure.time, segment.departure.date, segment.departure.timezone)}
                </div>
              )}
            </div>

            {/* Duration */}
            <div className="flex flex-col items-center justify-center">
              <div className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-2">В пути</div>
              <div className="relative w-full flex items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                  <div className={`w-full h-0.5 ${
                    isTrain ? 'bg-gradient-to-r from-amber-300 via-amber-400 to-amber-300' : 'bg-gradient-to-r from-sky-300 via-sky-400 to-sky-300'
                  }`}></div>
                </div>
                <div className={`relative px-4 py-2 rounded-full text-sm font-bold ${
                  isTrain ? 'bg-amber-100 text-amber-700' : 'bg-sky-100 text-sky-700'
                }`}>
                  {segment.duration}
                </div>
              </div>
              <div className="mt-2 text-2xl">
                →
              </div>
            </div>

            {/* Arrival */}
            <div className="space-y-2 text-right lg:text-left">
              <div className="text-gray-400 text-xs font-medium uppercase tracking-wider">Прибытие</div>
              <div className="flex items-baseline gap-2 lg:justify-start justify-end">
                <span className="text-3xl font-bold text-gray-800">{segment.arrival.time}</span>
                <span className="text-gray-500">{segment.arrival.date}</span>
              </div>
              <div className="flex items-center gap-2 lg:justify-start justify-end">
                <span className="text-lg">{arrTz.flag}</span>
                <span className="text-gray-700 font-medium">{segment.arrival.city}</span>
              </div>
              {segment.arrival.timezone !== 'moscow' && (
                <div className="text-sm text-gray-400 flex items-center gap-1 lg:justify-start justify-end">
                  🇷🇺 МСК: {convertToMoscow(segment.arrival.time, segment.arrival.date, segment.arrival.timezone)}
                </div>
              )}
            </div>
          </div>

          {/* Passenger tickets */}
          {isTrain && (
            <div className="mt-6 pt-4 border-t border-gray-100">
              <div className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-3">Места пассажиров</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {passengers.map((p, idx) => (
                  <div key={idx} className={`${p.bgColor} ${p.borderColor} border rounded-lg p-3 flex items-center gap-3`}>
                    <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${p.color} flex items-center justify-center text-white text-sm font-bold`}>
                      {p.shortName[0]}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-700">{p.shortName}</div>
                      <div className="text-xs text-gray-500">
                        {segment.id === 1 ? p.seats.train1 : p.seats.train2}
                      </div>
                      <div className="text-xs text-gray-400">
                        Билет: {segment.id === 1 ? p.tickets.train1 : p.tickets.train2}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Wait time */}
      {segment.waitTime && (
        <div className="ml-8 my-4 pl-6 border-l-2 border-dashed border-gray-300">
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm ${
            segment.waitLabel ? 'bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700' : 'bg-gray-100 text-gray-600'
          }`}>
            {segment.waitLabel ? (
              <>
                <span>{segment.waitLabel}</span>
                <span className="font-bold">{segment.waitTime}</span>
              </>
            ) : (
              <>
                <span>⏳ Ожидание:</span>
                <span className="font-bold">{segment.waitTime}</span>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export function App() {
  const outboundSegments = segments.filter(s => s.direction === 'outbound');
  const returnSegments = segments.filter(s => s.direction === 'return');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-100">
      {/* Плавающая кнопка пожеланий */}
      <WishButton />
      {/* World Clocks Sticky Header */}
      <WorldClocks />

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Outbound Journey */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <span className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white">→</span>
            Путь туда
          </h2>
          <div className="space-y-6">
            {outboundSegments.map((segment, idx) => (
              <SegmentCard key={segment.id} segment={segment} index={idx} />
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="relative my-12">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t-2 border-dashed border-gray-300"></div>
          </div>
          <div className="relative flex justify-center">
            <div className="bg-gradient-to-r from-amber-400 to-orange-500 text-white px-6 py-3 rounded-full shadow-lg font-bold text-lg">
              🏖️ Отдых в Паттайе: 11 — 24 февраля
            </div>
          </div>
        </div>

        {/* Return Journey */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <span className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white">←</span>
            Путь обратно
          </h2>
          <div className="space-y-6">
            {returnSegments.map((segment, idx) => (
              <SegmentCard key={segment.id} segment={segment} index={idx} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
