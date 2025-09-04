import { IconHexagonLetterHFilled } from '@tabler/icons-react';
import Link from 'next/link';
import { signIn } from '@/actions/auth';
import { Button } from '@/components/ui/button';

export default function Login() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background">
      {/* Purple Corner Background */}
      <div className="absolute inset-0 z-0 min-h-screen w-full overflow-hidden bg-background">
        {/* Grid + Left & Right Gradient Glow */}
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `
                        linear-gradient(to right, #f0f0f0 1px, transparent 1px),
                        linear-gradient(to bottom, #f0f0f0 1px, transparent 1px),
                        radial-gradient(circle 600px at 0% 200px, #d5c5ff, transparent),
                        radial-gradient(circle 600px at 100% 200px, #d5c5ff, transparent)
                      `,
            backgroundSize: `
                        96px 64px,    
                        96px 64px,    
                        100% 100%,    
                        100% 100%  
                      `,
          }}
        />
        {/* Your Content Here */}
      </div>

      {/* Content */}
      <div className="relative z-10 flex min-h-screen items-center justify-center p-6">
        <div className="w-full max-w-md space-y-8 text-center">
          {/* Brand section */}
          <div className="space-y-6">
            <div className="mx-auto inline-flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-primary to-primary/60 shadow-lg">
              <IconHexagonLetterHFilled className="size-14 text-white" />
            </div>

            <div className="space-y-3">
              <h1 className="font-bold text-4xl text-gray-900">Heychar</h1>

              <p className="text-gray-600 text-lg">
                Для продолжения необходимо авторизоваться
              </p>
            </div>
          </div>

          {/* Login form */}
          <form action={signIn} className="space-y-6">
            {/* Yandex login button */}
            <Button
              className="group relative h-14 w-full overflow-hidden rounded-xl font-semibold text-md"
              size="lg"
              variant="outline"
            >
              <span className="relative">
                Войти через <span className="font-bold text-red-500">Я</span>
                ндекс
              </span>
            </Button>

            {/* Footer text */}
            <p className="text-gray-500 text-sm">
              Нажимая кнопку, вы соглашаетесь с{' '}
              <Link className="text-primary hover:underline" href="#">
                условиями использования
              </Link>{' '}
              и{' '}
              <Link className="text-primary hover:underline" href="#">
                политикой конфиденциальности
              </Link>
            </p>
          </form>

          {/* Copyright */}
          <p className="-translate-x-1/2 absolute bottom-5 left-1/2 text-gray-400 text-sm">
            © Heychar. Все права защищены.
          </p>
        </div>
      </div>
    </div>
  );
}
