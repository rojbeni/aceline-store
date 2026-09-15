"use client"

import { Button, Heading, Text } from "@modules/common/components/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { useTranslation } from "@lib/context/translation-context"

const SignInPrompt = () => {
  const { t } = useTranslation()

  return (
    <div className="bg-white dark:bg-transparent flex items-center justify-between">
      <div>
        <Heading level="h2" >
          {t("Already have an account?")}
        </Heading>
        <Text className="text-ui-fg-subtle mt-2">
          {t("Sign in for a better experience.")}
        </Text>
      </div>
      <div>
        <LocalizedClientLink href="/account">
          <Button variant="secondary" className="h-10" data-testid="sign-in-button">
            {t("Sign in")}
          </Button>
        </LocalizedClientLink>
      </div>
    </div>
  )
}

export default SignInPrompt

