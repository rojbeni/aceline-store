"use client"

import { Button, Heading, Text } from "@modules/common/components/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { useTranslation } from "@lib/context/translation-context"

const SignInPrompt = () => {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col small:flex-row small:items-center justify-between gap-4 rounded-large border border-outline-variant bg-surface-container-low p-4 small:p-6">
      <div>
        <Heading level="h2">
          {t("Already have an account?")}
        </Heading>
        <Text className="text-ui-fg-subtle mt-2">
          {t("Sign in for a better experience.")}
        </Text>
      </div>
      <div>
        <LocalizedClientLink href="/account">
          <Button
            variant="secondary"
            className="h-10 w-full small:w-auto"
            data-testid="sign-in-button"
          >
            {t("Sign in")}
          </Button>
        </LocalizedClientLink>
      </div>
    </div>
  )
}

export default SignInPrompt

