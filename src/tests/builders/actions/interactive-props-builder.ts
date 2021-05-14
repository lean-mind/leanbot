import { InteractiveProps } from "../../../actions/interactive";

export const InteractivePropsBuilder = ({
  nextStep = "irrelevant-next-step",
  data = {},
  accept = true,
}: Partial<InteractiveProps>): InteractiveProps => ({
  nextStep,
  data,
  accept
})