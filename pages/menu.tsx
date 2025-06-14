// pages/menu.tsx
import type { GetStaticProps, NextPage } from 'next';
import Image from 'next/image';
import { fetchMenu, MenuRow } from '@/lib/google';
import { columnsPerCategory, groupRows } from '@/lib/menu-helpers';
import { useEffect } from 'react';
import PulseController from '@/components/PulseController';
import PacmanTrail from '@/components/PacmanTrail';



/* ───────────────────────────── types ─────────────────────────── */
interface MenuProps {
  rows: MenuRow[];
}

/* ───────────── цветные индикаторы ───────────── */
const typeColor = {
  hybrid: '#4f7bff',
  hybride: '#4f7bff',
  sativa: '#ff6633',
  indica: '#38b24f',
} as const;
type KnownType = keyof typeof typeColor;
const getTypeKey = (row: MenuRow): KnownType | null => {
  const raw = row.Type?.toLowerCase();
  if (!raw) return null;
  if (raw === 'hybride') return 'hybrid';
  return (Object.keys(typeColor) as KnownType[]).includes(raw as KnownType) ? (raw as KnownType) : null;
};

/* ───────────── категории по колонкам ───────────── */
const column1 = ['TOP SHELF', 'MID SHELF'];
const column2 = ['PREMIUM', 'SMALLS', 'CBG', 'PRE ROLLS'];
const column3 = ['FRESH FROZEN HASH', 'LIVE HASH ROSIN', 'DRY SIFT HASH', 'ICE BUBBLE HASH'];

/* ───────────── страница меню ───────────── */
const MenuPage: NextPage<MenuProps> = ({ rows }) => {
  const grouped = groupRows(rows);

  useEffect(() => {
    const interval = setInterval(() => {
      window.location.reload();
    }, 600000); // каждые 600 секунд (10 минут)

    return () => clearInterval(interval);
  }, []);

  return (
    <main className='min-h-screen flex flex-col items-center font-[Inter] text-neutral-900 bg-white'>

      <div className='mt-4' />
      {/* логотип + MENU */}
      <PulseController />
      <header className='flex items-center justify-center gap-3 text-[#536C4A] py-3'>
        <Image src='/logo-og-lab.svg' alt='OG Lab logo' width={100.3} height={29} />
        <h1 className='text-3xl font-extrabold tracking-widest'>MENU</h1>
      </header>

      <Line />
      <div className='mt-4' />

      <section className='w-full max-w-[1600px] pb-6 px-4 relative'>
        <div className='grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-8'>
          {/* 1 колонка */}
          <div className='space-y-8'>
            {column1.map(cat => (
              <CategoryBlock key={cat} name={cat} rows={grouped[cat] ?? []} />
            ))}
          </div>

          {/* 2 колонка */}
          <div className='space-y-8'>
            {column2.map(cat => (
              <CategoryBlock key={cat} name={cat} rows={grouped[cat] ?? []} />
            ))}
          </div>

          {/* 3 колонка */}
          <div className='relative pl-6'>
            <span className='hidden lg:block absolute left-[-12px] top-0 h-full w-[3px] bg-[var(--color-primary-light)]' />
            <div className='space-y-8'>
              {column3.map(cat => (
                <CategoryBlock key={cat} name={cat} rows={grouped[cat] ?? []} />
              ))}
            </div>
          </div>
        </div>
      </section>


      {/* нижняя полоса */}
      <Line />
      <div className='mt-4' />

      {/* легенда */}
      <footer className='mt-4 w-full max-w-[1570px] text-lg flex flex-wrap items-center gap-4 pb-6 px-4'>
        <LegendDot color={typeColor.hybrid} label='Hybrid' dataColor='hybrid' />
        <LegendDot color={typeColor.sativa} label='Dominant Sativa' dataColor='sativa' />
        <LegendDot color={typeColor.indica} label='Dominant Indica' dataColor='indica' />
        <LegendDot color='#536C4A' label='Our farm-grown' isLeaf />
        <span className='ml-auto text-lg'>Weed (with batches from 5g)</span>
        <span className='ml-auto text-lg'>Ask your budtender about a Dab Session</span>
      </footer>
      <PacmanTrail />
    </main>
  );
};
export default MenuPage;

/* ───────────── SSG (ISR 15 мин) ───────────── */
export const getStaticProps: GetStaticProps<MenuProps> = async () => {
  const rows = await fetchMenu();
  return { props: { rows }, revalidate: 900 };
};

/* ───────────── helpers & ui ───────────── */
function CategoryBlock({ name, rows }: { name: string; rows: MenuRow[] }) {
  const conf =
    columnsPerCategory[name] ??
    (name.toUpperCase().includes('HASH')
      ? { label: '', keys: ['Price_1g', 'Price_5g'] }
      : { label: 'THC', keys: ['THC', 'Price_5g', 'Price_20g'] });

  // Проверяем, есть ли хоть одно значение THC
  const showTHC = rows.some(r => r.THC);
  const priceKeys = conf.keys.filter(k => k !== 'THC' && k !== 'CBG');

  return (
    <div className='space-y-1'>
      {/* Заголовок секции */}
      <div className='menu-section-title flex items-center bg-[#536C4A] text-white font-bold px-2 py-1 rounded-sm uppercase tracking-wide'>
        <span className='flex-1'>{name}</span>
        {showTHC && <span className='w-16 text-right'>THC</span>}
        {priceKeys.map(k => (
          <span key={k} className='w-16 text-right'>{headerLabel(k)}</span>
        ))}
      </div>


      {/* Таблица */}
      <table className='w-full text-base table-fixed'>
        <tbody>
          {rows.map((r) => {
            const typeKey = getTypeKey(r);
            return (
              <tr key={r.Name} className='align-top hover:bg-[#f9f9f9] transition-colors'>
                <td className='py-0.5 pr-2 break-words max-w-[260px] align-top'>
                  {typeKey && (
                    <span
                      className='dot'
                      data-color={typeKey}
                      style={{ backgroundColor: typeColor[typeKey] }}
                    />
                  )}
                  {r.Our && (
                    <Image
                      src='/leaf.svg'
                      alt='Our farm-grown leaf icon'
                      width={12}
                      height={12}
                      className='leaf inline mr-[2px] align-middle'
                      data-color='leaf'
                    />
                  )}
                  {r.Name}
                </td>

                {/* THC */}
                {showTHC && (
                  <td className='py-0.5 w-16 text-right'>
                    {r.THC ? `${r.THC}%` : r.CBG ? `${r.CBG}%` : '-'}
                  </td>
                )}

                {/* Цены */}
                {priceKeys.map((k) => (
                  <td key={k} className='py-0.5 w-16 text-right'>
                    {r[k] ? `${r[k]}฿` : '-'}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>


    </div>
  );
}

const Line = () => (
  <div className='w-full max-w-[1570px] h-[3px] bg-[var(--color-primary-light)]' />
);

const headerLabel = (k: string) =>
({
  Price_1pc: '1PC',
  Price_1g: '1G+',
  Price_5g: '5G+',
  Price_20g: '20G+',
}[k] ?? k);



function LegendDot({
  color,
  label,
  isLeaf,
  dataColor,
}: {
  color: string;
  label: string;
  isLeaf?: boolean;
  dataColor?: string;
}) {
  return (
    <span className='flex items-center gap-1'>
      {isLeaf ? (
        <Image
          src='/leaf.svg'
          alt='Leaf icon'
          width={12}
          height={12}
          className='leaf'
          data-color='leaf'
        />
      ) : (
        <span
          className='dot'
          data-color={dataColor}
          style={{ backgroundColor: color }}
        />
      )}
      {label}
    </span>
  );
}