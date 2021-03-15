import { Community } from './../../../models/database/community';

export const CommunityBuilder = ({
  id = "irrelevant-community-id",
  platform = "slack",
  deletedAt = undefined
}: Partial<Community>): Community => new Community(
  id,
  platform,
  deletedAt
)