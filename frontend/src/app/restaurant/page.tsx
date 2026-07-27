"use client";

interface MenuItemType {
  name: string;
  description: string;
  price: number;
}

interface MenuCategoryProps {
  label: string;
  title: string;
  items: MenuItemType[];
  noMarginBottom?: boolean;
}

function MenuCategory({ label, title, items, noMarginBottom }: MenuCategoryProps) {
  // Split items into two columns
  const half = Math.ceil(items.length / 2);
  const col1 = items.slice(0, half);
  const col2 = items.slice(half);

  return (
    <div className={`mb-${noMarginBottom ? '0' : '14'}`}>
      <p className="text-[10px] tracking-[0.22em] text-gold font-medium mb-4 uppercase">
        {label}
      </p>
      <div className="font-display text-[36px] font-normal text-cream mb-1">
        {title}
      </div>
      <div className="w-12 h-[1px] bg-amber mb-7"></div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-16">
        <div>
          {col1.map((item, i) => (
            <div key={i} className="flex justify-between items-start py-4 border-b border-white/5 gap-4">
              <div className="flex-1">
                <div className="text-[14px] text-cream mb-1 font-normal">{item.name}</div>
                <div className="text-[12px] text-stone leading-[1.5]">{item.description}</div>
              </div>
              <div className="font-display text-[18px] text-gold font-medium whitespace-nowrap">
                ${item.price}
              </div>
            </div>
          ))}
        </div>
        <div>
          {col2.map((item, i) => (
            <div key={i} className="flex justify-between items-start py-4 border-b border-white/5 gap-4">
              <div className="flex-1">
                <div className="text-[14px] text-cream mb-1 font-normal">{item.name}</div>
                <div className="text-[12px] text-stone leading-[1.5]">{item.description}</div>
              </div>
              <div className="font-display text-[18px] text-gold font-medium whitespace-nowrap">
                ${item.price}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function RestaurantPage() {
  const starters = [
    { name: "Avocado bruschetta", description: "Sourdough, cherry tomato, micro herbs", price: 12 },
    { name: "Chilled prawn cocktail", description: "Marie rose, lemon, iceberg lettuce", price: 18 },
    { name: "Burrata & heirloom tomato", description: "Aged balsamic, basil oil, fleur de sel", price: 16 },
    { name: "French onion soup", description: "Gruyère crouton, thyme, beef broth", price: 32 },
  ];

  const mains = [
    { name: "Grass-fed ribeye steak", description: "Seasonal vegetables, jus, bone marrow", price: 24 },
    { name: "Pan-seared Atlantic salmon", description: "Lemon butter, capers, asparagus", price: 18 },
    { name: "Roasted chicken supreme", description: "Tarragon cream, wild mushrooms, truffle", price: 16 },
    { name: "Vegetable wellington", description: "Butternut squash, spinach, puff pastry", price: 32 },
  ];

  const desserts = [
    { name: "Chocolate fondant", description: "Vanilla bean ice cream, gold leaf", price: 12 },
    { name: "Crème brûlée", description: "Madagascar vanilla, caramelised sugar", price: 18 },
    { name: "Seasonal fruit tart", description: "Pastry cream, glazed fresh fruits", price: 16 },
    { name: "Cheese selection", description: "Five aged cheeses, quince, crackers", price: 32 },
  ];

  return (
    <main className="min-h-screen bg-forest">
      {/* Hero */}
      <div className="bg-forest pt-[140px] md:pt-[224px] pb-12 md:pb-20 px-6 md:px-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: "url('/pattern-page.svg')" }}></div>
        <p className="text-[10px] tracking-[0.22em] text-gold uppercase mb-4 relative">
          Fine Dining
        </p>
        <h1 className="font-display text-[clamp(44px,6vw,72px)] font-normal text-cream leading-[1.05] mb-5 relative">
          Taste cuisines from <em className="italic text-gold">all</em> over the World
        </h1>
        <p className="text-[15px] text-cream/55 leading-[1.8] max-w-[500px] relative">
          Mattis aliquam egestas vestibulum tellus tortor pulvinar. Velit sapien
          id fermentum aenean arcu eget. Viverra enim ac ut.
        </p>
      </div>

      {/* Menu Sections */}
      <div className="bg-forest px-6 md:px-16 py-16 md:py-24">
        <MenuCategory label="To begin" title="Starters" items={starters} />
        <MenuCategory label="The main event" title="Main Course" items={mains} />
        <MenuCategory label="Sweet endings" title="Desserts" items={desserts} noMarginBottom />
      </div>
    </main>
  );
}
