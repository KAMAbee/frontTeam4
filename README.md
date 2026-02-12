
# Как запустить проект (React + TypeScript)

## Быстрый старт

1. **Установите зависимости:**
   ```bash
   npm install
   ```

2. **Запустите проект в режиме разработки:**
   ```bash
   npm run dev
   ```
3. **Собрать проект для продакшена:**
   ```bash
   npm run build
   ```

4. **Проверить сборку:**
   ```bash
   npm run preview
   ```

---

## Как использовать module.scss

1. **Создайте файл стилей:**
   
   Например, для компонента `MyComponent.tsx` создайте рядом файл `MyComponent.module.scss`.

2. **Импортируйте стили в компонент:**
   ```tsx
   import styles from './MyComponent.module.scss';

   export function MyComponent() {
     return <div className={styles.myBlock}>
                <div className={styles.myBlock__item}>Hello </div>
            </div>;
   }
   ```

3. **Пишите стили как обычно:**
   ```scss
   // MyComponent.module.scss
   .myBlock {
     background-color: red;

     // Вложенность
     &__item{
        color: blue;

        //Вложенность во вложенности
        &:hover{
          color: black;
        }
     }
   }
   ```

> Используйте именно `.module.scss` для модульных стилей, чтобы избежать конфликтов имён классов между компонентами.

---

## Предлагаю структуру папок

```
src/
  components/
    headerComponents/
      HeaderFileName.tsx
      HeaderFileName.module.scss
    commonComponents/
      Button.tsx
      Button.module.scss
  assets/
    icons/
    images/
  App.tsx
  main.tsx
```

- **components/** — все React-компоненты
  - **mainComponents/** — основные/крупные компоненты
  - **commonComponents/** — переиспользуемые общие компоненты (кнопки, инпуты и т.д.)
- **assets/icons/** — иконки (в основном svg)
- **assets/images/** — изображения (без разницы в каком формате)

---

## Работа с иконками

- **Лучше всего использовать SVG-иконки.**
  - SVG легко масштабируются, не теряют качество и хорошо подходят для React.
  - Сохраняйте SVG-иконки в папку `src/assets/icons/`.
  - Для вставки SVG в компонент можно либо импортировать файл, либо вставить содержимое SVG прямо в JSX.

Пример импорта SVG как компонента:
```tsx
import { ReactComponent as LogoIcon } from '../assets/icons/logo.svg';

export function Logo() {
  return <LogoIcon fill={"#000000"} stroke={"#000000"}}/>;
}
```

---

## Почаще коммитьте, пушьте и пулльте, даже самую мелочь