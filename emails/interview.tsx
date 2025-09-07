import {
    Body,
    Button,
    Column,
    Container,
    Head,
    Heading,
    Hr,
    Html,
    Link,
    Preview,
    Row,
    Section,
    Text,
} from "@react-email/components"

interface InterviewEmailProps {
    job: string
    organisation: string
    interviewUrl: string
    candidateName?: string
}

const InterviewEmail = ({
    candidateName,
    job,
    organisation,
    interviewUrl,
}: InterviewEmailProps) => (
    <Html>
        <Head />
        <Body style={main}>
            <Preview>Your login code for Linear</Preview>
            <Container style={container}>
                <Container>
                    <Section>
                        <Row>
                            <Column style={logoContainer}>
                                <svg
                                    fill="#818cf8"
                                    height="24"
                                    stroke="none"
                                    viewBox="0 0 24 24"
                                    width="24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <title>Hexagon Letter H Filled</title>
                                    <path d="M13.666 1.429l6.75 3.98l.096 .063l.093 .078l.106 .074a3.22 3.22 0 0 1 1.284 2.39l.005 .204v7.284c0 1.175 -.643 2.256 -1.623 2.793l-6.804 4.302c-.98 .538 -2.166 .538 -3.2 -.032l-6.695 -4.237a3.23 3.23 0 0 1 -1.678 -2.826v-7.285c0 -1.106 .57 -2.128 1.476 -2.705l6.95 -4.098c1 -.552 2.214 -.552 3.24 .015m.334 5.571a1 1 0 0 0 -1 1v3h-2v-3a1 1 0 0 0 -.883 -.993l-.117 -.007a1 1 0 0 0 -1 1v8a1 1 0 0 0 2 0v-3h2v3a1 1 0 0 0 .883 .993l.117 .007a1 1 0 0 0 1 -1v-8a1 1 0 0 0 -1 -1" />
                                </svg>
                                <strong>HEYCHAR</strong>
                            </Column>
                        </Row>
                    </Section>
                </Container>

                <Heading style={heading}>
                    {candidateName
                        ? `Здравствуйте, ${candidateName}!`
                        : "Здравствуйте!"}
                </Heading>
                <Text style={paragraph}>
                    Вы были приглашены на собеседование в{" "}
                    <strong>{organisation}</strong> на вакансию{" "}
                    <strong>{job}</strong>.
                    <br />
                    <br />
                    Его можно пройти в любое удобное для вас время как онлайн,
                    так и по телефону, заказав обратный звонок. Перейдите по
                    ссылке ниже и выберите удобный способ проведения
                    собеседования.
                </Text>
                <Section style={buttonContainer}>
                    <Button href={interviewUrl} style={button}>
                        К собеседованию
                    </Button>
                </Section>

                <Text style={paragraph}>
                    Если это предложение вам не подходит, пожалуйста,{" "}
                    <Link href="https://heychar.ru" style={link}>
                        отклоните
                    </Link>{" "}
                    его.
                </Text>

                <Hr style={hr} />
                <Link href="https://heychar.ru" style={reportLink}>
                    Heychar.ru
                </Link>
                <Text style={secondaryParagraph}>
                    Это сообщение было отправлено автоматически, не отвечайте на
                    него
                </Text>
            </Container>
        </Body>
    </Html>
)

InterviewEmail.PreviewProps = {
    candidateName: "Иван",
    job: "Разработчик Next.js",
    organisation: "ГК КАМИН",
    interviewUrl: "https://heychar.ru/interview",
} as InterviewEmailProps

export default InterviewEmail

const logoContainer = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "5px",
}

const main = {
    backgroundColor: "#ffffff",
    fontFamily:
        '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
}

const container = {
    margin: "0 auto",
    padding: "20px 0 48px",
    maxWidth: "560px",
}

const heading = {
    fontSize: "24px",
    letterSpacing: "-0.5px",
    lineHeight: "1.3",
    fontWeight: "400",
    color: "#484848",
    padding: "17px 0 0",
}

const paragraph = {
    margin: "0 0 10px",
    fontSize: "15px",
    lineHeight: "1.4",
    color: "#3c4149",
}

const secondaryParagraph = {
    margin: "10px 0",
    fontSize: "15px",
    lineHeight: "1.4",
    color: "#aaaaaa",
}

const buttonContainer = {
    padding: "14px 0",
}

const button = {
    backgroundColor: "#818cf8",
    borderRadius: "6px",
    fontWeight: "600",
    color: "#fff",
    fontSize: "15px",
    textDecoration: "none",
    textAlign: "center" as const,
    display: "block",
    padding: "11px 23px",
}

const reportLink = {
    fontSize: "14px",
    color: "#b4becc",
}

const link = {
    fontSize: "14px",
    color: "#818cf8",
}

const hr = {
    borderColor: "#dfe1e4",
    margin: "14px 0",
}
