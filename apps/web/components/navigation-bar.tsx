import { getTranslations } from 'next-intl/server';
import { HfmMarketsLogo, MobileDevice, LocaleSwitcherEn } from '@repo/icons';
import { Button } from '@repo/ui/button';

export async function NavigationBar() {
  const t = await getTranslations('NavigationBar');

  return (
    <header className="bg-darkest-gray">
      <div className="mx-auto flex h-[132px] max-w-6xl flex-col justify-center gap-4">
        <div className="flex items-end justify-between gap-4">
          <span className="text-medium-gray text-xxs leading-2.5 font-normal">
            Member of HF Markets Group
          </span>
          <div className="text-lightest-gray flex items-center gap-4 text-sm">
            <div className="border-dark-gray flex items-center gap-2 rounded-md border-[0.5px] px-2 py-1">
              <MobileDevice className="h-4 w-auto shrink-0" aria-hidden />
              Download App
            </div>
            <div>Contact us</div>
            <div className="text-bold-gray" aria-hidden>
              |
            </div>
            <div>Partner with us</div>
            <div className="text-bold-gray" aria-hidden>
              |
            </div>
            <LocaleSwitcherEn className="h-[17px] w-auto" aria-hidden />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <HfmMarketsLogo
              className="h-[58px] w-auto"
              aria-label={t('logoAlt')}
            />
          </div>
          <div className="flex gap-[17px]">
            <Button variant="secondary" size="small">
              Login
            </Button>
            <Button variant="primary" size="small">
              Register
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
