# 🏋️ Gym Tracker Monorepo

Moderní aplikace pro sledování tréninků s plnohodnotnou webovou a mobilní verzí.  Vše v jednom monorepu s sdíleným backendem a autentizací.

## ✨ Hlavní Funkce

- 📱 **Multiplatformní** - Plně funkční webová a mobilní aplikace
- 🔄 **Real-time synchronizace** - Okamžitá aktualizace dat napříč zařízeními
- 🔐 **Bezpečná autentizace** - Moderní auth systém s BetterAuth
- 🎨 **Konzistentní design** - Sdílené komponenty s Tailwind CSS
- ⚡ **Optimalizovaný build** - Rychlé sestavení díky Turborepo
- 📊 **Type-safe** - Plná podpora TypeScript

## 🛠️ Tech Stack

### Frontend
- **Web**:  [TanStack Start](https://tanstack.com/start) - Full-stack React framework
- **Mobile**:  [React Native](https://reactnative.dev/) + [Expo](https://expo.dev/)
- **UI Libraries**: 
  - [shadcn/ui](https://ui.shadcn.com/) (web)
  - [Uniwind](https://uniwind.dev/) (mobile)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)

### Backend
- **Database & API**: [Convex](https://convex.dev/) - Real-time backend
- **Authentication**: [BetterAuth](https://www.better-auth.com/)

### Monorepo Management
- **Build System**: [Turborepo](https://turbo.build/repo)
- **Package Manager**: npm/pnpm/yarn/bun (zde použit)

## 📁 Struktura Projektu

```
gym-app-monorepo/
├── apps/
│   ├── web/              # Web aplikace (TanStack Start)
│   └── mobile/           # Mobilní aplikace (React Native + Expo)
├── packages/
│   ├── ui/               # Sdílené UI komponenty
│   ├── types/            # Sdílené TypeScript typy
│   └── config/           # Sdílené konfigurace (ESLint, TS, Tailwind)
├── convex/               # Convex backend (databáze, API, funkce)
├── turbo.json            # Turborepo konfigurace
└── package.json          # Root package.json
```

## 🚀 Rychlý Start

### Předpoklady

- Node.js 18+ a npm/pnpm/yarn
- Expo CLI (pro mobilní vývoj)
- Convex account ([convex.dev](https://convex.dev))

### Instalace

1. **Naklonujte repozitář**
   ```bash
   git clone https://github.com/JakubJirak/gym-app-monorepo.git
   cd gym-app-monorepo
   ```

2. **Nainstalujte závislosti**
   ```bash
   npm install
   ```

3. **Nastavte Convex**
   ```bash
   npx convex dev
   ```
   Postupujte podle instrukcí pro přihlášení a inicializaci projektu.

4. **Nakonfigurujte environment variables**
   
   Vytvořte `.env.local` v `apps/web` a `apps/mobile`:
   ```env
   CONVEX_URL=https://your-convex-deployment.convex.cloud
   BETTER_AUTH_SECRET=your-secret-key
   BETTER_AUTH_URL=http://localhost:3000
   ```

### Spuštění Development Serveru

**Vše najednou:**
```bash
npm run dev
```

**Pouze web:**
```bash
npm run dev --filter=web
```

**Pouze mobile:**
```bash
npm run dev --filter=mobile
```

**Pouze Convex:**
```bash
npx convex dev
```

### 📱 Spuštění Mobilní Aplikace

```bash
cd apps/mobile
npx expo start
```

Naskenujte QR kód v Expo Go aplikaci nebo použijte emulátor/simulátor.

## 🏗️ Build

**Produkční build všech aplikací:**
```bash
npm run build
```

**Build specifické aplikace:**
```bash
npm run build --filter=web
npm run build --filter=mobile
```

## 📝 Vývoj

### Přidání nové funkce

1. Vytvořte feature branch
   ```bash
   git checkout -b feature/nova-funkce
   ```

2. Implementujte změny v příslušném balíčku/aplikaci

3. Otestujte napříč platformami
   ```bash
   npm run dev
   ```

4. Commitněte a pushnete změny
   ```bash
   git add .
   git commit -m "feat: přidána nová funkce"
   git push origin feature/nova-funkce
   ```

### Práce s Convex

Backend funkce jsou v `convex/` složce: 

```typescript
// convex/workouts. ts
import { query, mutation } from ". /_generated/server";
import { v } from "convex/values";

export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query("workouts").collect();
  },
});

export const create = mutation({
  args: { name: v.string(), exercises: v.array(v.any()) },
  handler: async (ctx, args) => {
    return await ctx.db.insert("workouts", args);
  },
});
```

### Sdílené Komponenty

Vytvářejte znovupoužitelné komponenty v `packages/ui`:

```tsx
// packages/ui/src/Button.tsx
export interface ButtonProps {
  label: string;
  onPress: () => void;
}

export const Button = ({ label, onPress }: ButtonProps) => {
  return <button onClick={onPress}>{label}</button>;
};
```

## 🧪 Testování

```bash
npm run test
```

## 📦 Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Spustí všechny aplikace v dev módu |
| `npm run build` | Build všech aplikací |
| `npm run lint` | Spustí ESLint na všech balíčcích |
| `npm run type-check` | TypeScript type checking |
| `npm run clean` | Smaže všechny node_modules a build artefakty |

## 🔐 Autentizace

Aplikace používá BetterAuth pro moderní, bezpečnou autentizaci s podporou: 

- 📧 Email/Password
- 🔗 OAuth providers (Google, GitHub, atd.)
- 🔄 Session management
- 🛡️ CSRF ochrana

## 🌐 Deployment

### Web (TanStack Start)
- **Vercel** (doporučeno)
- **Netlify**
- **Cloudflare Pages**

### Mobile (Expo)
```bash
cd apps/mobile
eas build --platform all
eas submit --platform all
```

### Convex
Convex se automaticky deployuje při push do production branch.

## 🤝 Přispívání

Příspěvky jsou vítány!  Prosím: 

1. Forkněte projekt
2. Vytvořte feature branch (`git checkout -b feature/AmazingFeature`)
3. Commitněte změny (`git commit -m 'Add some AmazingFeature'`)
4. Pushněte do branch (`git push origin feature/AmazingFeature`)
5. Otevřete Pull Request

## 📄 Licence

Tento projekt je licencován pod MIT licencí - viz [LICENSE](LICENSE) soubor pro detaily.

## 👨‍💻 Autor

**Jakub Jirak** - [@JakubJirak](https://github.com/JakubJirak)

## 🙏 Poděkování

- [Convex](https://convex.dev/) za skvělý real-time backend
- [TanStack](https://tanstack.com/) za moderní React framework
- [Expo](https://expo.dev/) za usnadnění React Native vývoje
- [Turborepo](https://turbo.build/) za rychlé buildy

---

⭐ Pokud se vám projekt líbí, dejte mu hvězdičku! 
