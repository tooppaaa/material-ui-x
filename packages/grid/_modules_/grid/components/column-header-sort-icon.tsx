import * as React from 'react';
import Badge from '@material-ui/core/Badge';
import IconButton from '@material-ui/core/IconButton';
import { IconsOptions, SortDirection } from '../models';
import { useIcons } from '../hooks/utils/useIcons';

export interface ColumnHeaderSortIconProps {
  direction: SortDirection;
  index: number | undefined;
  hide?: boolean;
}

function getIcon(icons: IconsOptions, direction: SortDirection) {
  const Icon = direction === 'asc' ? icons!.columnSortedAscending! : icons!.columnSortedDescending!;
  return <Icon className="MuiDataGrid-sortIcon" />;
}

export const ColumnHeaderSortIcon: React.FC<ColumnHeaderSortIconProps> = React.memo(
  ({ direction, index, hide }) => {
    const icons = useIcons();

    if (hide || direction == null) {
      return null;
    }

    return (
      <span>
        {index != null && (
          <Badge badgeContent={index} color="default">
            <IconButton aria-label="Sort" size="small">
              {getIcon(icons, direction)}
            </IconButton>
          </Badge>
        )}
        {index == null && (
          <IconButton aria-label="Sort" size="small">
            {getIcon(icons, direction)}
          </IconButton>
        )}
      </span>
    );
  },
);
ColumnHeaderSortIcon.displayName = 'ColumnHeaderSortIcon';
