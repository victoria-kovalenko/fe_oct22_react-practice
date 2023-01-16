import React, { useState } from 'react';
import './App.scss';
import cn from 'classnames';
import { PhotoFull } from './type/types';

import usersFromServer from './api/users';
import photosFromServer from './api/photos';
import albumsFromServer from './api/albums';

const getPreaperedPhoto = (): PhotoFull[] => {
  return photosFromServer.map(photo => {
    const album = albumsFromServer.find(a => a.id === photo.albumId);
    const user = usersFromServer.find(u => u.id === album?.userId);

    return {
      ...photo,
      album,
      user,
    };
  });
};

export const App: React.FC = () => {
  const [photos] = useState(getPreaperedPhoto);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUserId, setSelectedUserId] = useState(0);
  const [selectedAlbumIds, setSelectedAlbumIds] = useState<number[]>([]);

  const onSelectAlbumFilter = (id: number) => {
    setSelectedAlbumIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter(el => el !== id);
      }

      return [...prev, id];
    });
  };

  const clearSelectedAlbum = () => {
    setSelectedAlbumIds([]);
  };

  const clearFilters = () => {
    clearSelectedAlbum();
    setSearchQuery('');
    setSelectedUserId(0);
  };

  const preaperedSearchQuery = searchQuery.toLowerCase();

  const visiblePhotos = photos.filter(photo => {
    const searchedPhoto = photo.title.toLowerCase().includes(
      preaperedSearchQuery,
    );

    const isUserMatch = selectedUserId
      ? photo.user?.id === selectedUserId
      : true;

    const isAlbumMatch = selectedAlbumIds.length
      ? selectedAlbumIds.includes(photo.album?.id || 0)
      : true;

    return searchedPhoto && isUserMatch && isAlbumMatch;
  });

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Photos from albums</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <p className="panel-tabs has-text-weight-bold">
              <a
                className={cn({ 'is-active': selectedUserId === 0 })}
                href="#/"
                onClick={() => setSelectedUserId(0)}
              >
                All
              </a>

              {usersFromServer.map(user => (
                <a
                  className={cn({ 'is-active': selectedUserId === user.id })}
                  href="#/"
                  key={user.id}
                  onClick={() => setSelectedUserId(user.id)}
                >
                  {user.name}
                </a>
              ))}
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  type="text"
                  className="input"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                {searchQuery && (
                  <span className="icon is-right">
                    {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                    <button
                      data-cy="ClearButton"
                      type="button"
                      className="delete"
                      onClick={() => setSearchQuery('')}
                    />
                  </span>
                )}
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                className={cn('button is-success mr-6', {
                  'is-outlined': selectedAlbumIds.length,
                })}
                onClick={clearSelectedAlbum}
              >
                All
              </a>

              {albumsFromServer.map(album => (
                <a
                  className={cn('button mr-2 my-1', {
                    'is-info': selectedAlbumIds.includes(album.id),
                  })}
                  href="#/"
                  onClick={() => onSelectAlbumFilter(album.id)}
                  key={album.id}
                >
                  {album.title}
                </a>
              ))}
            </div>

            <div className="panel-block">
              <a
                href="#/"
                className="button is-link is-outlined is-fullwidth"
                onClick={clearFilters}

              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {visiblePhotos.length === 0 && (
            <p data-cy="NoMatchingMessage">
              No photos matching selected criteria
            </p>
          )}

          <table
            className="table is-striped is-narrow is-fullwidth"
          >
            <thead>
              <tr>
                <th>
                  <span className="is-flex is-flex-wrap-nowrap">
                    ID

                    <a href="#/">
                      <span className="icon">
                        <i data-cy="SortIcon" className="fas fa-sort" />
                      </span>
                    </a>
                  </span>
                </th>

                <th>
                  <span className="is-flex is-flex-wrap-nowrap">
                    Photo name

                    <a href="#/">
                      <span className="icon">
                        <i className="fas fa-sort-down" />
                      </span>
                    </a>
                  </span>
                </th>

                <th>
                  <span className="is-flex is-flex-wrap-nowrap">
                    Album name

                    <a href="#/">
                      <span className="icon">
                        <i className="fas fa-sort-up" />
                      </span>
                    </a>
                  </span>
                </th>

                <th>
                  <span className="is-flex is-flex-wrap-nowrap">
                    User name

                    <a href="#/">
                      <span className="icon">
                        <i className="fas fa-sort" />
                      </span>
                    </a>
                  </span>
                </th>
              </tr>
            </thead>

            <tbody>
              {visiblePhotos.map(photo => (
                <tr key={photo.id}>
                  <td className="has-text-weight-bold">
                    {photo.id}
                  </td>

                  <td>{ photo.title}</td>
                  <td>{photo.album?.title }</td>

                  <td
                    className={cn({
                      'has-text-link': photo.user?.sex === 'm',
                      'has-text-danger': photo.user?.sex === 'f',
                    })}
                  >
                    {photo.user?.name}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
